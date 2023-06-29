const util = require('util');
const { exec } = require('child_process');

const execPromise = util.promisify(exec);

async function executeCommand(command) {
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout:\n${stdout}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

module.exports = {
  executeCommand
};
