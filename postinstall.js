const path = require('path');
const fs = require('fs');
const os = require('os');
const rimraf = require('rimraf');
const unzipper = require('unzipper');

const platform = os.platform();

const zips = {
  darwin: 'toolchain_macos.zip',
  linux: 'toolchain_linux.zip'
};

Object.keys(zips).forEach(zipPlatform => {
  if (zipPlatform !== platform) {
    rimraf(zips[zipPlatform], () => {});
    return;
  }

  const rs = fs.createReadStream(path.join(__dirname, zips[platform]));
  rs.on('open', () => {
    const ws = rs.pipe(unzipper.Extract({
      path: __dirname,
    })).on('entry', () => {
      rimraf(zips[platform], () => {});
    });
  });

  rs.on('error', err => {
    if (err.code === 'ENOENT') {
      process.exit(0);
    } else {
      throw err;
    }
  });
});

process.on('uncaughtException', err => {
  console.warn(err.stack);
});
