const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const tf = require("@tensorflow/tfjs-node");
const NodeWebcam = require("node-webcam");
const fs = require("fs");
const path = require("path");

// Set up Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Set up webcam and model variables
const webcamOptions = {
  width: 640,
  height: 480,
  quality: 100,
  delay: 0,
  saveShots: true,
  output: "jpeg",
  device: false,
  callbackReturn: "buffer",
  verbose: false,
};

const Webcam = NodeWebcam.create(webcamOptions);
const tempImagePath = path.join(__dirname, "temp_frame.jpg");
let model, metadata;

// Load model
async function loadModel() {
  const modelPath = "file://" + path.join(__dirname, "model", "model.json");
  model = await tf.loadLayersModel(modelPath);

  const metadataPath = path.join(__dirname, "model", "metadata.json");
  metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

  console.log("Model loaded successfully");
}

// Capture and classify
async function captureAndClassify() {
  try {
    // Capture image
    await new Promise((resolve, reject) => {
      Webcam.capture(tempImagePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Read and process image
    const imageBuffer = fs.readFileSync(tempImagePath);
    const tfimage = tf.node.decodeImage(imageBuffer);
    const resized = tf.image.resizeBilinear(tfimage, [224, 224]);
    const normalized = resized.div(255.0);
    const batched = normalized.expandDims(0);

    // Run prediction
    const predictions = await model.predict(batched).data();

    // Process results
    const results = Array.from(predictions)
      .map((score, i) => ({
        class: metadata.labels[i],
        score: score,
      }))
      .sort((a, b) => b.score - a.score);

    // Clean up
    tfimage.dispose();
    resized.dispose();
    normalized.dispose();
    batched.dispose();

    return {
      results,
      imageBase64: `data:image/jpeg;base64,${imageBuffer.toString("base64")}`,
    };
  } catch (error) {
    console.error("Error in captureAndClassify:", error);
    return { error: error.message };
  }
}

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("classify", async () => {
    const data = await captureAndClassify();
    socket.emit("classification-result", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await loadModel();
});
