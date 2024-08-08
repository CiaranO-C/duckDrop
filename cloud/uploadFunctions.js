const cloudinary = require("./cloudinaryConfig");
const { Readable } = require('node:stream')

async function uploadStream(buffer) {
  return new Promise((res, rej) => {
    const transformStream = cloudinary.uploader.upload_stream(
      options,
      (err, result) => {
        if (err) return rej(err);
        res(result);
      },
    );
    let str = Readable.from(buffer);
    str.pipe(transformStream);
  });
}

module.exports = { uploadStream }
