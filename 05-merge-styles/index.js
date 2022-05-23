const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');

const write = fs.createReadStream(distPath, 'utf8');

fs.readdir(stylesPath, { withFileTypes: true }, (error, files) => {
  if (error) console.error(error);
  // console.log(files);
  let cssArr = [];
  let i = -1;
  files.forEach((file) => {
    let trueCSSFiles = file.name.split('.')[1];
    if (trueCSSFiles === 'css') {
      const filePath = path.join(stylesPath, file.name);
      const stream = fs.createReadStream(filePath, 'utf-8');
      // console.log(stream);
      stream.on('readable', () => {
        let data = stream.read();
        console.log(data);
        if (data !== null) {
          console.log(cssArr);
          cssArr.push(data);
          fs.open(path.join(distPath, 'bundle.css'), 'w', (err) => {
            if (err) throw err;
            i = i + 1;
            console.log(cssArr[i]);
            fs.appendFile(
              path.join(distPath, 'bundle.css'),
              cssArr[i],
              (err) => {
                if (err) throw err;
              }
            );
          });
        }
      });
    }
  });
});
// создать поток записи, пройтись циклом по файлам, для каждого создавать поток чтения перенаправляя его через pipe в поток записи
