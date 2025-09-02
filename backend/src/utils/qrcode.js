const QRCode = require('qrcode');

function generateQRCode(url) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }, (err, dataUrl) => {
      if (err) {
        reject(err);
      } else {
        resolve(dataUrl);
      }
    });
  });
}

function generateQRCodeBuffer(url) {
  return new Promise((resolve, reject) => {
    QRCode.toBuffer(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

module.exports = {
  generateQRCode,
  generateQRCodeBuffer
};
