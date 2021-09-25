   
var commands = require('minimist')(process.argv.slice(2));
const linkExtractor = require('./linkExtractor');

let initialImagesPath = commands.initialImagesPath;
let comparedImagesPath = commands.comparedImagesPath;

if(commands.length <= 1)
{
    initialImagesPath = null;
    comparedImagesPath = null;
}

linkExtractor.getLinks(commands.baseurl, initialImagesPath, comparedImagesPath);
//https://0a15-115-248-53-14.ngrok.io/


