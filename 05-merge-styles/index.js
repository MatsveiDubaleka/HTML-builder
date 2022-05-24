const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');

const write = fs.createWriteStream(distPath, 'utf8');

fs.readdir(stylesPath, { withFileTypes: true }, (error, files) => {
  if (error) console.error(error);
  files.forEach((file) => {
    let trueCSSFiles = file.name.split('.')[1];
    if (trueCSSFiles === 'css') {
      const filePath = path.join(stylesPath, file.name);
      const readStream = fs.createReadStream(filePath, {
        encoding: 'utf-8',
      });
      readStream.on('data', (styles) => {
        write.write(styles);
      });
    }
  });
  console.log('Styles are merged');
});
// создать поток записи, пройтись циклом по файлам, для каждого создавать поток чтения перенаправляя его через pipe в поток записи
