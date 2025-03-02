# Chili Pepper Classifier for Raspberry Pi and Windows

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

#### On Raspberry Pi (Linux)

```bash
sudo apt update
sudo apt upgrade
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
```

#### On Windows

1. Download the Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the installation wizard
3. Select the default options when prompted

Verify installation (on either platform):

```bash
node --version
npm --version
```

### 3. Install project dependencies

#### On Raspberry Pi

Clone or download this repository to your Raspberry Pi, then install the dependencies:

```bash
git clone https://github.com/spencerjirehcebrian/classysili.git
cd classysili
npm install
```

#### On Windows

1. Open Command Prompt (cmd)
2. Navigate to the directory where you want to store the project:

```cmd
cd C:\path\to\projects\folder
```

3. Clone the repository (if you have Git installed):

```cmd
git clone https://github.com/spencerjirehcebrian/classysili.git
cd classysili
```

Or download and extract the ZIP file from the repository and navigate to it:

```cmd
cd C:\path\to\extracted\folder
```

4. Install dependencies:

```cmd
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

### On Raspberry Pi

To start the application:

```bash
node web-server.js
```

### On Windows

Open Command Prompt and navigate to the project directory:

```cmd
cd C:\path\to\project\folder
node web-server.js
```

The server will start on port 3000 by default. You can access the web interface by opening a browser and navigating to:

```
http://localhost:3000
```

If you want to access it from another device on the same network:

- On Raspberry Pi: use the Raspberry Pi's IP address: `http://[raspberry-pi-ip-address]:3000`
- On Windows: use the Windows computer's IP address: `http://[windows-ip-address]:3000`

To find your IP address:

- On Windows: Open Command Prompt and type `ipconfig`
- On Raspberry Pi: Open Terminal and type `hostname -I`

## Using the Application

1. Open the web interface in a browser
2. Click the "Capture and Classify" button to take a picture with the webcam
3. The system will process the image and display the classification results
4. The results will show each possible class with a confidence score
5. The highest confidence match will be marked as "Top Match"
6. Click "Reset" to take another picture

## Troubleshooting

### Camera Issues

#### On Raspberry Pi

- Make sure your webcam is compatible with Raspberry Pi
- Check that the webcam is properly connected
- Try a different USB port if the camera isn't detected
- Use `lsusb` command to verify the camera is recognized

#### On Windows

- Check that the webcam is properly connected and drivers are installed
- Try a different USB port if the camera isn't detected
- Verify the camera works in other applications (like Camera app)
- Check Device Manager to ensure the camera is recognized without errors

### Permission Issues (Windows)

- Run Command Prompt as Administrator if you encounter permission errors
- Allow the application through Windows Firewall if prompted
- Ensure your Windows user has permission to access the webcam (Privacy settings)

### Performance Issues

- The model is optimized for edge devices, but classification might be slower on less powerful hardware
- Close other applications when running the classifier
- On Raspberry Pi: Consider overclocking for better performance (advanced users only)
- On Windows: Ensure you have at least 4GB of RAM and a modern processor

### Classification Accuracy

- Ensure good lighting conditions for best results
- Position the chili pepper clearly in the camera's field of view
- Avoid backgrounds that might confuse the classifier
- Try to match the lighting conditions used during model training

## Advanced Configuration

### Changing the Port

To change the default port (3000), modify the PORT variable in `web-server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

### Auto-start Options

#### On Raspberry Pi

To make the application start automatically when the Raspberry Pi boots:

1. Create a systemd service file:

```bash
sudo nano /etc/systemd/system/classysili.service
```

2. Add the following content (modify paths as needed):

```
[Unit]
Description=ClassySili Service
After=network.target

[Service]
ExecStart=/usr/bin/node /home/pi/classysili/web-server.js
WorkingDirectory=/home/pi/classysili
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:

```bash
sudo systemctl enable classysili.service
sudo systemctl start classysili.service
```

#### On Windows

To make the application start automatically when Windows boots:

1. Create a batch file (e.g., `start-classifier.bat`) in the project directory:

```cmd
@echo off
cd %~dp0
node web-server.js
```

2. Create a shortcut to this batch file
3. Press `Win + R` and type `shell:startup`
4. Move the shortcut to the Startup folder that opens
5. The application will now start automatically on boot

## Model Information

The image classification model was trained using Teachable Machine (version 2.4.7) and converted to TensorFlow.js format. It uses a MobileNet architecture optimized for edge devices like Raspberry Pi.

- Input image size: 224x224 pixels
- Number of classes: 8 (4 classes each for 2 types of chili peppers)
- Model format: TensorFlow.js Layers model

## Contact

For questions or support, please open an issue on the [GitHub repository](https://github.com/spencerjirehcebrian/classysili/issues).
