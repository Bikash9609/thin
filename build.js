const readline = require('readline');
const { spawn } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = [
  {
    number: 1,
    description: 'Debug apk (cd android && ./gradlew assembleDebug)',
  },
  {
    number: 2,
    description: 'Release app (cd android && ./gradlew assembleRelease)',
  },
  { number: 3, description: 'Release aab (yarn build:android)' },
  {
    number: 4,
    description:
      'Release aab after upgrading version (yarn update:version && yarn build:android)',
  },
];

const askUserInput = () => {
  console.log('Select the build option:');
  options.forEach(option => {
    console.log(`${option.number}. ${option.description}`);
  });

  rl.question('Enter option number: ', answer => {
    const selectedOption = options.find(opt => opt.number === parseInt(answer));
    if (selectedOption) {
      executeBuildCommand(selectedOption.description);
    } else {
      console.log('Invalid option selected.');
      rl.close();
    }
  });
};

const executeBuildCommand = optionDescription => {
  console.log(`Executing command for ${optionDescription}`);

  let command, args, cwd;

  switch (optionDescription) {
    case 'Debug apk (cd android && ./gradlew assembleDebug)':
      // Command for building release APK using Gradle
      command = './gradlew';
      args = ['assembleDebug'];
      cwd = 'android'; // Execute in android directory
      break;
    case 'Release app (cd android && ./gradlew assembleRelease)':
      // Command for building release APK using Gradle
      command = './gradlew';
      args = ['assembleRelease'];
      cwd = 'android'; // Execute in android directory
      break;
    case 'Release aab (yarn build:android)':
      // Command for building AAB using yarn
      command = 'yarn';
      args = ['build:android'];
      cwd = null; // Assumes yarn is globally installed or in PATH
      break;
    case 'Release aab after upgrading version (yarn update:version && yarn build:android)':
      // Command for updating version and then building AAB
      command = 'sh'; // Use shell to execute multiple commands
      args = ['-c', 'yarn update:version && yarn build:android'];
      cwd = null; // Assumes yarn is globally installed or in PATH
      break;
    default:
      console.log('Invalid option.');
      rl.close();
      return;
  }

  const child = spawn(command, args, { cwd });

  child.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  child.on('close', code => {
    console.log(`Child process exited with code ${code}`);
    console.log(`✨  ${optionDescription} build completed.`);
    rl.close();
  });
};

// Start by asking user input
askUserInput();
