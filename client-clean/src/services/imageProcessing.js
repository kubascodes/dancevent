var Jimp = require('jimp');

function Progress(context) {
    this.currentProgress = 0;
    this.setUploadProgress = context.setUploadProgress;
  }

export default async function ProcessImage (image, imageUrl, crop, context) {

        let progressBar = new Progress(context);
        //if (!crop) { let crop = "default"; }
        if (image.type == 'image/png' || image.type == 'image/jpeg' || image.type == 'image/bmp' || image.type == 'image/tiff' || image.type == 'image/gif') {
          try {
            progressBar.setUploadProgress(10);
            let image = await Jimp.read(imageUrl);
            if (image) { progressBar.setUploadProgress(25); }
            //settings for crop(x-axis, y-axis, width, height)
            let cropSettings = [];
            switch (crop) {
              case "profilePicture":
                //for profile picture
                cropSettings = [400, 400]
                break;
              case "eventPicture":
                //for event pictures
                cropSettings = [1000, 600]
                break;
              default:
                //for other images
                let defaultImage = image.resize(Jimp.AUTO, 1000);
                cropSettings = [Number(defaultImage.bitmap.width), Number(defaultImage.bitmap.height)];
                break;
            }
            /*
            let imageResize = await image.resize(Jimp.AUTO, cropSettings[1]).quality(70);
            if (imageResize) { progressBar.setUploadProgress(50); }
            let imageCrop = await imageResize.crop(Number((imageResize.bitmap.width-cropSettings[0])), Number((imageResize.bitmap.height-cropSettings[1])), Number(cropSettings[0]), Number(cropSettings[1]));
            if (imageCrop) { progressBar.setUploadProgress(75);}
            */ 
            let imageCrop = await image.cover(cropSettings[0], cropSettings[1], Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).quality(70);
            if (imageCrop) { progressBar.setUploadProgress(50); }



            let imageBase64 = await imageCrop.getBase64Async(Jimp.MIME_JPEG);
            if (imageBase64) { progressBar.setUploadProgress(100); } //complete on this tick
            return imageBase64;
          }
          catch (error) {
            console.log(error);
            return(error);
          }
        }
        else {
          alert("Unsupported image type. Please upload a JPG, PNG, BMP, TIFF or GIF image.")
        }
      };
