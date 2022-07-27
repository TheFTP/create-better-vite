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

let folderName = process.argv[2];
if(!folderName) {
    console.error(`${chalk.red('Please provide an installation folder name.')} ${chalk.blueBright('(or use "." to install in the current directory)')}`);
    process.exit();
}
if(folderName !== folderName.toLowerCase()) {
    console.error(chalk.red('Folder name must be lowercase.'));
    process.exit();
}

const gitCheckoutCommand = `git clone --depth 1 https://github.com/QVGK/vite-react ${folderName}`;
const installDepsCommand = `cd ${folderName} && npm install`;

log(chalk.blueBright(`Cloning Repository into ${folderName}`));
const checkedOut = runCommand(gitCheckoutCommand);

if(!checkedOut) {
    log(chalk.red(`Failed to clone repository into ${folderName}`));
    process.exit();
}

log(chalk.blueBright(`Installing Dependencies for ${folderName}`));
const depsInstalled = runCommand(installDepsCommand);
if(!depsInstalled) {
    log(chalk.red(`Failed to install dependencies for ${folderName}`));
    process.exit();
}

log(chalk.blueBright(`Welcome to QVGK's Vite Template for React`));
log()
log(chalk.blueBright('This is an edited version of the default Vite template.'));
log()
log(chalk.blueBright('To start, run:'));
log(chalk.green(`cd ${folderName} && npm run dev`));