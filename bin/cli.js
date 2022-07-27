#!/usr/bin/env node

// Dependencies
import { execSync } from 'child_process';
import chalk from 'chalk';

// Variables
let FrameworkName = process.argv[2];
let folderName = process.argv[3];
let gitCheckoutCommand;
const log = console.log;
const installDepsCommand = `cd ${folderName} && npm install`;

// Functions
const runCommand = (cmd) => {
    try {
        execSync(`${cmd}`, { stdio: 'inherit' });
    } catch(err) {
        console.error(`Failed to execute ${cmd}`, err);
        return false
    }
    return true
}
const validateFramework = (framework) => {
    if(framework.toLowerCase() === 'react') {
        return true
    }

    if(framework.toLowerCase() === 'preact') {
        return true
    }

    return false
}

// Validation
if(!FrameworkName || !folderName) {
    log(chalk.red('Framework name and folder name are required.'));
    log(chalk.red('Example usage:'))
    log(chalk.green('$ npx @qvgk/create-vite@latest <framework-name> <folder-name>'));
    process.exit();
}
if(validateFramework(FrameworkName)) {
    gitCheckoutCommand = `git clone https://github.com/QVGK/vite-${FrameworkName.toLowerCase()} ${folderName}`;
} else {
    log(chalk.red('Please provide a valid framework.'));
    log(chalk.blueBright('React'));
    log(chalk.hex('#bf00ff')('Preact'));
    log(`${chalk.greenBright('Vue')} ${chalk.redBright('Coming soon!')}`);
    log(`${chalk.hex('#FFA500')('Svelte')} ${chalk.redBright('Coming soon!')}`);
    process.exit();
}
if(folderName !== folderName.toLowerCase()) {
    log(chalk.red('Folder name must be lowercase.'));
    process.exit();
}

// Installation
log(chalk.blueBright(`Downloading files and installing into ${folderName}`));
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

// Success
log(chalk.blueBright(`Welcome to QVGK's Vite Template for ${FrameworkName.toUpperCase()}`));
log()
log(chalk.blueBright('This is an edited version of the default Vite template.'));
log()
log(chalk.blueBright('To start, run:'));
log(chalk.green(`$ cd ${folderName}`));
log(chalk.green('$ npm run dev'))