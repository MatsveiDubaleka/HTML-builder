const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

function createFolder() {
  fs.rm(
    path.join(__dirname, 'project-dist'),
    { recursive: true, force: true },
    (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      fs.mkdir(
        path.join(__dirname, 'project-dist'),
        { recursive: true },
        (err) => {
          if (err) {
            return console.error(err);
          }
          console.log('\nПапка project-dist создана');
          fs.mkdir(
            path.join(__dirname, 'project-dist', 'assets'),
            { recursive: true },
            (err) => {
              if (err) {
                return console.error(err);
              }
              copyAssetsFolder();
              compileStyle();
              buildHTML(templateWay, componentsWay, projectDistWay);
            }
          );
        }
      );
    }
  );
}
createFolder();

function copyAssetsFolder() {
  const dirWayIn = path.join(__dirname, 'project-dist', 'assets');
  const dirWayOut = path.join(__dirname, 'assets');

  fs.readdir(dirWayOut, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      console.log('Папка assets создана');
      files.forEach((file) => {
        fs.mkdir(path.join(dirWayIn, file.name), { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          const fileWayIn = path.join(
            __dirname,
            'project-dist',
            'assets',
            file.name
          );
          const fileWayOut = path.join(__dirname, 'assets', file.name);
          fs.readdir(fileWayOut, { withFileTypes: true }, (err, files) => {
            if (err) console.log(err);
            else {
              files.forEach((file) => {
                fs.copyFile(
                  path.join(fileWayOut, file.name),
                  path.join(fileWayIn, file.name),
                  (err) => {
                    if (err) {
                      console.log('Error Found:', err);
                    }
                  }
                );
              });
            }
          });
        });
      });
    }
  });
}

function compileStyle() {
  fs.readdir(
    path.join(__dirname, 'styles'),
    { withFileTypes: true },
    (err, files) => {
      if (err) console.log(err);
      else {
        let arr = [];
        let i = -1;
        files.forEach((file) => {
          if (file.isFile()) {
            const wayStyles = path.join(__dirname, 'styles', file.name);
            fs.stat(wayStyles, (err, stats) => {
              if (err) console.log(err);
              const main = path.parse(file.name);
              if (main.ext === '.css') {
                const stream = new fs.ReadStream(wayStyles);
                stream.on('readable', function () {
                  let data = stream.read();
                  if (data !== null) {
                    arr.push(data.toString('utf8'));
                    fs.open(
                      path.join(__dirname, 'project-dist', 'style.css'),
                      'w',
                      (err) => {
                        if (err) throw err;
                        i = i + 1;
                        fs.appendFile(
                          path.join(__dirname, 'project-dist', 'style.css'),
                          arr[i],
                          (err) => {
                            if (err) throw err;
                          }
                        );
                      }
                    );
                  }
                });
              }
            });
          }
        });
        console.log('style.css сформирован из css файлов папки styles');
      }
    }
  );
}

const templateWay = path.join(__dirname, 'template.html');
const componentsWay = path.join(__dirname, 'components');
const projectDistWay = path.join(__dirname, 'project-dist');

async function buildHTML(templateWay, componentsWay, projectDistWay) {
  let template = await fsPromises.readFile(templateWay, 'utf8');

  const componentFileNames = await fsPromises.readdir(componentsWay);
  for (let i = 0; i < componentFileNames.length; i += 1) {
    let file = componentFileNames[i];
    if (file.endsWith('.html')) {
      let componentName = file.split('.')[0];
      let componentFileWay = path.join(__dirname, 'components', file);

      let fileDate = await fsPromises.readFile(componentFileWay);
      template = template.replace(new RegExp(`{{${componentName}}}`), fileDate);
    }
  }
  fs.writeFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    template,
    (err) => {
      if (err) throw err;
    }
  );
  console.log('index.html сформирован исходя из тегов');
}
