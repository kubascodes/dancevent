var Jimp = require('jimp');

async function ProcessImage (image, imageUrl, crop) {
        console.log(image.type);
        if (!crop) { let crop = "default"; }
        if (image.type == 'image/png' || image.type == 'image/jpeg' || image.type == 'image/bmp' || image.type == 'image/tiff' || image.type == 'image/gif') {
          try {
            let image = await Jimp.read(imageUrl);
            //settings for crop(x-axis, y-axis, width, height)
            let cropSettings = [];
            switch (crop) {
              case "profilePicture":
                //for profile picture
                cropSettings = [400, 400]
                break;
              case "eventPicture":
                //for event pictures
                cropSettings = [800, 600]
                break;
              default:
                //for other images
                let defaultImage = image.resize(1000, Jimp.AUTO);
                cropSettings = [Number(defaultImage.bitmap.width), Number(defaultImage.bitmap.height)];
                break;
            }
            let imageResize = await image.resize(Number(cropSettings[0]), Jimp.AUTO).quality(70);
            let imageCrop = await imageResize.crop(Number((imageResize.bitmap.width-cropSettings[0])/2), Number((imageResize.bitmap.height-cropSettings[1])/2), Number(cropSettings[0]), Number(cropSettings[1]));
            let imageBase64 = await imageCrop.getBase64Async(Jimp.MIME_JPEG);
            return imageBase64;
          }
          catch (error) {
            return(error);
          }
        }
        else {
          alert("Unsupported image type. Please upload a JPG, PNG, BMP, TIFF or GIF image.")
        }
      };

export default ProcessImage;
