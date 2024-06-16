const { spawn, exec } = require('child_process');
const path = require('path');

// Define paths
const projectPath = path.resolve();

// Define commands
const watchDelCommand = `watchman watch-del '${projectPath}'`;
const watchProjectCommand = `watchman watch-project '${projectPath}'`;

// Function to execute commands
const clearWatchman = () => {
  // Execute watch-del command
  exec(watchDelCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing watch-del command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`watch-del command executed successfully: ${stdout}`);

    // Execute watch-project command
    exec(watchProjectCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(
          `Error executing watch-project command: ${error.message}`,
        );
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`watch-project command executed successfully: ${stdout}`);
    });
  });
};

async function runEmulator() {
  try {
    clearWatchman();
    // Check for running emulator
    const adbDevices = spawn('adb', ['devices']);
    const devices = await new Promise((resolve, reject) => {
      let output = '';
      adbDevices.stdout.on('data', data => {
        output += data.toString();
      });
      adbDevices.on('close', () => {
        resolve(output.includes('emulator'));
      });
      adbDevices.stderr.on('error', reject);
    });

    if (devices) {
      console.log('Emulator is already running');
      return;
    }

    // Get list of available emulators
    const emulatorList = spawn('emulator', ['-list-avds']);
    const emulatorName = await new Promise((resolve, reject) => {
      let output = '';
      emulatorList.stdout.on('data', data => {
        output += data.toString();
      });
      emulatorList.on('close', () => {
        const lines = output.split('\n').filter(Boolean); // Filter out empty lines
        if (lines.length === 0) {
          reject(new Error('No AVDs found'));
        } else {
          resolve(lines[lines.length - 1]); // Get the last non-empty line
        }
      });
      emulatorList.stderr.on('error', reject);
    });

    // Start the emulator in detached mode
    const emulatorProcess = spawn('emulator', ['-avd', emulatorName], {
      detached: true,
      stdio: 'ignore',
    });

    emulatorProcess.unref(); // Allow the parent process to exit independently of the child

    console.log(`Starting emulator: ${emulatorName}`);
  } catch (error) {
    console.error('Error running emulator:', error);
  }
}

runEmulator();
