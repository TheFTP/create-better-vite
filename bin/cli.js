const { execSync } = require('child_process');

const runCommand = (cmd) => {
    try {
        execSync(`${cmd}`, { stdio: 'inherit' });
    } catch(err) {
        console.error(`Failed to execute ${cmd}`, err);
        return false
    }
    return true
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/QVGK/qvgk-vite-react ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Cloning Repository as ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);

if(!checkedOut) {
    console.log(`Failed to clone repository as ${repoName}`);
    process.exit(1);
}

console.log(`Installing Dependencies for ${repoName}`);
const depsInstalled = runCommand(installDepsCommand);
if(!depsInstalled) {
    console.log(`Failed to install dependencies for ${repoName}`);
    process.exit(1);
}

console.log(`Successfully cloned repository as ${repoName}`);
console.log('Please run the following command to start:')
console.log(`cd ${repoName} && npm start`);