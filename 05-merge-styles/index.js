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
      console.log(filePath);
      const readStream = fs.createReadStream(filePath, {
        encoding: 'utf-8',
      });
      readStream.on('data', (styles) => {
        write.write(styles);
      });
      // stream.on('readable', () => {
      //   let data = stream.read();
      //   console.log(data);
      //   if (data !== null) {
      //     console.log(cssArr);
      //     cssArr.push(data);
      //     fs.open(path.join(distPath, 'bundle.css'), 'w', (err) => {
      //       if (err) throw err;
      //       i = i + 1;
      //       console.log(cssArr[i]);
      //       fs.appendFile(
      //         path.join(distPath, 'bundle.css'),
      //         cssArr[i],
      //         (err) => {
      //           if (err) throw err;
      //         }
      //       );
      //     });
      //   }
      // });
    } else {
      return;
    }
  });
});
// создать поток записи, пройтись циклом по файлам, для каждого создавать поток чтения перенаправляя его через pipe в поток записи
