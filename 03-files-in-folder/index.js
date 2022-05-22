const path = require('path');
const fs = require('fs');

const truePath = path.join(__dirname, 'secret-folder');

fs.readdir(truePath, { withFileTypes: true }, (err, files) => {
  // getKb(truePath);
  if (err) {
    console.error(err.message);
  } else {
    files.forEach((file) => {
      if (file.isDirectory() === true) {
        return;
      }
      let fileName = file.name.split('.')[0];
      let fileExt = file.name.split('.')[1];

      let filePath = path.join(truePath, file.name);

      getKb(filePath);

      function getKb(path) {
        fs.stat(path, (error, file) => {
          if (error) {
            console.error(error.message);
          }
          let fileSize = file.size;
          getFullInfo(fileName, fileExt, fileSize);
        });
      }
    });
  }
});

function getFullInfo(name, ext, size) {
  console.log(name + ' - ' + ext + ' - ' + size);
}
