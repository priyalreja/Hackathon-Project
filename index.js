var commands = require('minimist')(process.argv.slice(2));
const linkExtractor = require('./linkExtractor');
const generateHashCode = require('./generateHashCode')

linkExtractor.getLinks('https://playwright.dev');



 