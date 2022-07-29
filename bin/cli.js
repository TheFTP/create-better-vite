#!/usr/bin/env node

// Dependencies
import { execSync } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import validator from 'validator';
import updateNotifier from 'update-notifier';
import fetch from 'node-fetch';

import packageJson from '../package.json' assert {type: 'json'};

// Variables
const log = console.log;
const red = chalk.redBright;
const blue = chalk.blueBright;
const green = chalk.greenBright;
const yellow = chalk.yellowBright;

let folderName;
let colouredFrameworkName;
let frameworkName;

let packageVersion = packageJson.version;

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

// Update Notifier
await fetch('https://registry.npmjs.org/create-better-vite/latest').then(res => res.json().then(data => {
    if(data.version !== packageVersion) {
        log()
        log(yellow(`A new version of create-better-vite is available.`));
        log(yellow(`Please update to continue.`))
        log()
        log(red(`Current version: ${packageVersion}`));
        log(blue(`Latest version: ${data.version}`));
        log()
        log(green(`$ npm create better-vite@${data.version}`));
        log()
        process.exit()
    }
}));

// Questions
await inquirer.prompt({
    name: 'folderName',
    type: 'input',
    message: 'Where do you want to install the project?',
    default: '.'
}).then(answer => {
    folderName = answer.folderName;
})

await inquirer.prompt({
    name: 'frameworkName',
    type: 'list',
    message: 'What framework do you want to use?',
    choices: [chalk.hex('#03cafc')('React'), chalk.hex('#c619ff')('Preact')]
}).then(answer => {
    colouredFrameworkName = answer.frameworkName;
    if(answer.frameworkName === chalk.hex('#03cafc')('React')) {
        frameworkName = 'react';
    }

    if(answer.frameworkName === chalk.hex('#c619ff')('Preact')) {
        frameworkName = 'preact';
    }
})

if(folderName !== folderName.toLowerCase() || !validator.isAlpha(folderName)) {
    log(red('Please make sure the folder name is lowercase and alpha. (a-z)'))
    process.exit()
}

// Installation
log()
log()
if(folderName === '.') {
    log(blue(`Downloading files for ${colouredFrameworkName} and installing them into in the current directory...`));
} else {
    log(blue(`Downloading files for ${colouredFrameworkName} and installing them into ${green(folderName)}...`));
}

const checkedOut = runCommand(`git clone --depth=1 https://github.com/FixedTemplateProject/vite-${frameworkName}.git ${folderName}`);

if(!checkedOut) {
    if(folderName === '.') {
        log(red('Failed to clone repository into the current directory. (is there a hidden .git folder?)'));
    } else {
        log(red(`Failed to clone repository into ${folderName}`));
    }
    process.exit();
}

log(blue(`Installing and updating necessary dependencies...`));
const depsInstalled = runCommand(`cd ${folderName} && npm install && npm update`);
if(!depsInstalled) {
    log(red(`Failed to install and update dependencies for ${folderName}`));
    process.exit();
}

// Success
log()
log()
log(`${blue(`Welcome to The`)} ${chalk.bold.underline(`${red(`Fixed`)}${chalk.hex('#0034c4')(` Template `)}${green(`Project's`)}`)} ${blue(`Vite starter template for`)} ${colouredFrameworkName}`);
log()
log(blue('This is an edited version of the default Vite template.'));
log()
log(blue('To start, run:'));
if(folderName !== '.') {
    log(green(`$ cd ${folderName}`));
}
log(green('$ npm run dev'))