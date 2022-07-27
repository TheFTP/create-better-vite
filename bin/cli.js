#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';
const log = console.log

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
if(repoName === '.') {
    console.error(chalk.red('You cannot use "." as the repository name.'));
    process.exit();
}
const gitCheckoutCommand = `git clone --depth 1 https://github.com/QVGK/qvgk-vite-react ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

log(chalk.blueBright(`Cloning Repository as ${repoName}`));
const checkedOut = runCommand(gitCheckoutCommand);

if(!checkedOut) {
    log(chalk.red(`Failed to clone repository as ${repoName}`));
    process.exit();
}

log(chalk.blueBright(`Installing Dependencies for ${repoName}`));
const depsInstalled = runCommand(installDepsCommand);
if(!depsInstalled) {
    log(chalk.red(`Failed to install dependencies for ${repoName}`));
    process.exit();
}

log(chalk.blueBright(`Welcome to QVGK's Vite Template for React`));
log()
log(chalk.blueBright('This template makes the default Vite template much more smooth.'));
log()
log(chalk.blueBright('To start, run:'));
log(chalk.green(`cd ${repoName} && npm start`));