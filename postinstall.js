const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');

const lib = 'toolchain.zip';

const rs = fs.createReadStream(path.join(__dirname, lib));
rs.on('open', () => {
  const ws = rs.pipe(unzipper.Extract({
    path: __dirname,
  }));
});

rs.on('error', err => {
  if (err.code === 'ENOENT') {
    process.exit(0);
  } else {
    throw err;
  }
});

process.on('uncaughtException', err => {
  console.warn(err.stack);
});
