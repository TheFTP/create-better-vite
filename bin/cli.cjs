import { execSync } from 'child_process';
import chalk from 'chalk';

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
if(!repoName) {
    console.error(chalk.red('Please provide a repository name.'));
    process.exit();
}
if(repoName !== repoName.toLowerCase()) {
    console.error(chalk.red('Repository name must be lowercase.'));
    process.exit();
}
const gitCheckoutCommand = `git clone --depth 1 https://github.com/QVGK/qvgk-vite-react ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(chalk.blue(`Cloning Repository as ${repoName}`));
const checkedOut = runCommand(gitCheckoutCommand);

if(!checkedOut) {
    console.log(chalk.red(`Failed to clone repository as ${repoName}`));
    process.exit();
}

console.log(chalk.blue(`Installing Dependencies for ${repoName}`));
const depsInstalled = runCommand(installDepsCommand);
if(!depsInstalled) {
    console.log(chalk.red(`Failed to install dependencies for ${repoName}`));
    process.exit();
}

console.log(chalk.blue(`Successfully cloned repository as ${repoName}`));
console.log(chalk.blue('Please run the following command to start:'))
console.log(chalk.blue(`cd ${repoName} && npm start`));