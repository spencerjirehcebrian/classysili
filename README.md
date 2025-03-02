# Raspberry Pi Chili Pepper Classifier

## Hardware Requirements

- Raspberry Pi (3 or newer recommended)
- Webcam compatible with Raspberry Pi
- Power supply for Raspberry Pi
- Internet connection (for initial setup)
- Optional: Display, keyboard, and mouse

## Software Prerequisites

- Node.js (v12 or newer)
- npm (Node Package Manager)
- Git (optional, for cloning the repository)

## Installation

### 1. Set up your Raspberry Pi

If you haven't already set up your Raspberry Pi, follow the official Raspberry Pi setup guide to install the Raspberry Pi OS.

### 2. Install Node.js and npm

```bash
sudo apt update
sudo apt upgrade
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:

```bash
node --version
npm --version
```

### 3. Install project dependencies

Clone or download this repository to your Raspberry Pi, then install the dependencies:

```bash
git clone git@github.com:spencerjirehcebrian/classysili.git
cd classysili
npm install
```

### 4. Connect your webcam

Connect your webcam to the Raspberry Pi via USB.

## Project Structure

- `web-server.js` - Main Node.js server file
- `public/index.html` - Frontend web interface
- `model/model.json` - TensorFlow.js model configuration
- `model/metadata.json` - Model metadata including class labels
- `model/weights.bin` - Model weights (not shown in the provided files)

## Running the Application

To start the application:

```bash
node web-server.js
```

The server will start on port 3000 by default. You can access the web interface by opening a browser on your Raspberry Pi and navigating to:

```
http://localhost:3000
```

If you want to access it from another device on the same network, use the Raspberry Pi's IP address:

```
http://[raspberry-pi-ip-address]:3000
```

## Using the Application

1. Open the web interface in a browser
2. Click the "Capture and Classify" button to take a picture with the webcam
3. The system will process the image and display the classification results
4. The results will show each possible class with a confidence score
5. The highest confidence match will be marked as "Top Match"
6. Click "Reset" to take another picture

## Troubleshooting

### Camera Issues

- Make sure your webcam is compatible with Raspberry Pi
- Check that the webcam is properly connected
- Try a different USB port if the camera isn't detected
- Use `lsusb` command to verify the camera is recognized

### Performance Issues

- The model is optimized for Raspberry Pi, but classification might be slower than on more powerful hardware
- Close other applications when running the classifier
- Consider overclocking your Raspberry Pi for better performance (advanced users only)

### Classification Accuracy

- Ensure good lighting conditions for best results
- Position the chili pepper clearly in the camera's field of view
- Avoid backgrounds that might confuse the classifier

## Advanced Configuration

### Changing the Port

To change the default port (3000), modify the PORT variable in `web-server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

### Auto-start on Boot

To make the application start automatically when the Raspberry Pi boots:

1. Create a systemd service file:

```bash
sudo nano /etc/systemd/system/chili-classifier.service
```

2. Add the following content (modify paths as needed):

```
[Unit]
Description=Chili Pepper Classifier Service
After=network.target

[Service]
ExecStart=/usr/bin/node /home/pi/chili-classifier/web-server.js
WorkingDirectory=/home/pi/chili-classifier
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:

```bash
sudo systemctl enable chili-classifier.service
sudo systemctl start chili-classifier.service
```

## Model Information

The image classification model was trained using Teachable Machine (version 2.4.7) and converted to TensorFlow.js format. It uses a MobileNet architecture optimized for edge devices like Raspberry Pi.

- Input image size: 224x224 pixels
- Number of classes: 8 (4 classes each for 2 types of chili peppers)
- Model format: TensorFlow.js Layers model
