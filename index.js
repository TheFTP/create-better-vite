#!/usr/bin/env node

/*
Copyright (c) 2022 The Fixed Template Project

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Dependencies
import { execSync } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import validator from 'validator';
import fetch from 'node-fetch';
import fs from 'fs';

// Variables
const log = console.log;
const packageVersion = '2.0.1';

const red = chalk.redBright;
const noRed = chalk.hex('#ff0000')

const blue = chalk.blue
const skyBlue = chalk.hex('#87CEEB')
const lightBlurple = chalk.hex('#7289da')
const reactBlue = chalk.hex('#00D8FF');

const green = chalk.greenBright;
const yesGreen = chalk.hex('#00FF00');

const yellow = chalk.yellowBright;

const purple = chalk.hex('#800080');
const preactPurple = chalk.hex('#9D00FF');

let sendStats = false
let folderName;
let colouredFrameworkName;
let frameworkName;

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
    log(yellow(`Warning: You are using a development version of create-better-vite.`));
    log()
}

// Questions
await inquirer.prompt({
    name: 'statsQuestion',
    type: 'list',
    message: `Can we send anonymous usage statistics?`,
    choices: [yesGreen('Yes'), noRed('No')]
}).then(answer => {
    if(answer.statsQuestion === yesGreen('Yes')) {
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

if(!validator.isAlpha(folderName) && folderName !== '.') {
    log(red('Please make sure the folder name is alpha. (a-z, A-Z)'))
    process.exit()
}

await inquirer.prompt({
    name: 'frameworkName',
    type: 'list',
    message: 'What framework do you want to use?',
    choices: [reactBlue('React'), preactPurple('Preact')]
}).then(answer => {
    colouredFrameworkName = answer.frameworkName;
    if(answer.frameworkName === reactBlue('React')) {
        frameworkName = 'React';
    }

    if(answer.frameworkName === preactPurple('Preact')) {
        frameworkName = 'Preact';
    }
})

if(sendStats) {
    await fetch('https://stats.better-vite.qvgk.net', {
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
        })
        .catch(err => {
            log();
            log(red('Failed to send usage statistics.'));
        })
}

// Installation
log()
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

log(blue(`Changing package.json name to ${green(folderName)}...`));
if(folderName !== '.') {
    if(folderName === folderName.toLowerCase()) {
        try {
            let templatePackageJson = JSON.parse(fs.readFileSync(`./${folderName}/package.json`, 'utf8'));
            log('Getting package.json data...')
            templatePackageJson.name = folderName;
            log('Changed name value.')
            fs.writeFileSync(`./${folderName}/package.json`, JSON.stringify(templatePackageJson, null, 2));
            log('Successfully wrote package.json.')
        } catch(err) {
            log(red('Failed to change package.json name.'));
        }
    } else {
        log('Skipping package.json name change due to name having capitals.')
    }
} else {
    log('Skipping package.json name change due to current directory.')
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
log(`Welcome to ${chalk.bold.underline(`${noRed(`F`)}${lightBlurple(`T`)}${yesGreen(`P`)}`)}'s Vite starter template for ${colouredFrameworkName}`);
if(folderName !== '.') {
    log()
    log(skyBlue(`Open ${colouredFrameworkName} folder:`));
    log(green(` $ cd ${folderName}`));
}
log()
log(skyBlue('Run development server:'));
log(green(' $ npm run dev'))
log()
log(skyBlue('Build for production:'));
log(green(' $ npm run build'))
log()