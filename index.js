   
var commands = require('minimist')(process.argv.slice(2));
const linkExtractor = require('./linkExtractor');
const links = linkExtractor.getLinks('https://0a15-115-248-53-14.ngrok.io/');

console.log(links);