#!/usr/bin/env node

// Dependencies
import { execSync } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import validator from 'validator';
import fetch from 'node-fetch';

import packageJson from '../package.json' assert {type: 'json'};

// Variables
const log = console.log;
const red = chalk.redBright;
const blue = chalk.blueBright;
const green = chalk.greenBright;
const yellow = chalk.yellowBright;

let sendStats = false
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
    if(data.version !== packageVersion && !packageVersion.includes('dev')) {
        log()
        log(yellow(`A new version of create-better-vite is available.`));
        log()
        log(red(`Current version: ${packageVersion}`));
        log(chalk.hex('#03cafc')(`Latest version: ${data.version}`));
        log()
        log(green(`$ npm create better-vite@${data.version}`));
        log()
    }
}));

// Dev Version Notifier
if(packageVersion.includes('dev')) {
    log()
    log(yellow(`Warning: You are using a development version of create-better-vite.`));
    log()
}

// Questions
await inquirer.prompt({
    name: 'statsQuestion',
    type: 'list',
    message: `Can we send anonymous usage statistics?`,
    choices: [green('Yes'), red('No')]
}).then(answer => {
    if(answer.statsQuestion === green('Yes')) {
        sendStats = true
    }
})

if(process.argv[2]) {
    folderName = process.argv[2];
} else {
    await inquirer.prompt({
        name: 'folderName',
        type: 'input',
        message: 'Where do you want to install the project?',
        default: '.'
    }).then(answer => {
        folderName = answer.folderName;
    })
}

if(folderName !== folderName.toLowerCase() || !validator.isAlpha(folderName)) {
    log(red('Please make sure the folder name is lowercase and alpha. (a-z)'))
    process.exit()
}

await inquirer.prompt({
    name: 'frameworkName',
    type: 'list',
    message: 'What framework do you want to use?',
    choices: [chalk.hex('#03cafc')('React'), chalk.hex('#c619ff')('Preact')]
}).then(answer => {
    colouredFrameworkName = answer.frameworkName;
    if(answer.frameworkName === chalk.hex('#03cafc')('React')) {
        frameworkName = 'React';
    }

    if(answer.frameworkName === chalk.hex('#c619ff')('Preact')) {
        frameworkName = 'Preact';
    }
})

if(sendStats) {
    await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                framework: frameworkName
            })
        }).then(res => {
            log();
            log(green(`Sent usage statistics. Thank you for using create-better-vite!`));
            log();
        })
        .catch(err => {
            log();
            log(red('Failed to send usage statistics.'));
            log();
        })
}

// Installation
if(folderName === '.') {
    log(blue(`Downloading files for ${colouredFrameworkName} and installing them into in the current directory...`));
} else {
    log(blue(`Downloading files for ${colouredFrameworkName} and installing them into ${green(folderName)}...`));
}

const checkedOut = runCommand(`git clone --depth=1 https://github.com/FixedTemplateProject/vite-${frameworkName.toLowerCase()}.git ${folderName}`);

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