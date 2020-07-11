var Jimp = require('jimp');

function ProcessImage (image, imageUrl) {
        console.log(image.type);
        if (image.type == 'image/png' || image.type == 'image/jpeg' || image.type == 'image/bmp' || image.type == 'image/tiff' || image.type == 'image/gif') {
          console.log(imageUrl);
          return new Promise(function(resolve, reject){
          Jimp.read(imageUrl)
          .then(function (image) {
                  image.resize(Jimp.AUTO, 400)
                  .quality(70)
                  .getBase64(Jimp.MIME_JPEG, function (err, result) {
                    console.log(result);
                    resolve(result);
                });})
                .catch(function (err) {
                  //console.error(err);
                  reject(err);
                });
              })
        }
        else {
          alert("Unsupported image type. Please upload a JPG, PNG, BMP, TIFF or GIF image.")
        }
      };

export default ProcessImage;
