var commands = require('minimist')(process.argv.slice(2));
const linkExtractor = require('./linkExtractor');

linkExtractor.getLinks('https://playwright.dev');



 