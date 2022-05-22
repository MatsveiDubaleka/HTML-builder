const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');

fs.rm(
  path.join(__dirname, 'files-copy'),
  { recursive: true, force: true },
  (err) => {
    if (err) {
      console.error(err);
    } else {
      createFolder();
    }
  }
);

function createFolder() {
  fs.mkdir(
    path.join(__dirname, 'files-copy'),
    { recursive: true },
    (error, any) => {
      if (error) console.error(error);
      if (any === undefined) {
        console.log('Folder already exists');
      } else {
        console.log('Folder is successfully done');
      }
    }
  );
  copyFiles();
}

function copyFiles() {
  fs.readdir(folderPath, (error, files) => {
    if (error) console.error(error);
    files.forEach((file) => {
      fs.copyFile(
        path.join(folderPath, file),
        path.join(__dirname, 'files-copy', file),
        () => {
          console.log(path.join(__dirname, 'files-copy', file));
        }
      );
    });
  });
}
