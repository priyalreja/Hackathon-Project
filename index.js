var commands = require('minimist')(process.argv.slice(2));
console.log('\n',commands);

 let params=commands;
 //console.log(params);
 if(params.baseurl=='www.pinterest.com')
 console.log('THE BASE URL PROVIDED IS :' , params.baseurl ,'next...\n');
 else
 console.log("the url not found");


 