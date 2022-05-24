const fs = require('fs');
const process = require('process');
const path = require('path');
const readline = require('readline');

const textfile = path.join(__dirname, 'destination.txt');

fs.writeFile(textfile, '', (error) => {
  if (error) {
    console.error(error.message);
  } else {
    process.stdout.write('Write \n');
  }
});
const output = fs.createWriteStream(textfile);

const rl = readline.createInterface(process.stdin, process.stdout);

rl.on('SIGINT', () => {
  process.emit('SIGINT');
  console.log('goodbye');
  rl.close();
});

rl.on('line', (input) => {
  if (input == 'exit') {
    rl.write('Good luck!');
    rl.close();
  } else {
    output.write(input);
  }
});
