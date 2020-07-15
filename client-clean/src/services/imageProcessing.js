var Jimp = require('jimp');

export class Progress {
  constructor(currentProgress, context) {
    this.currentProgress = currentProgress;
    this.setUploadProgress = context.setUploadProgress;
  }
  getProgress() {
    return this.currentProgress;
  };
  setProgress (completed) {
    this.currentProgress = completed;
    this.setUploadProgress(this.getProgress());
  }
}

export default async function ProcessImage (image, imageUrl, crop, context) {

        let progressBar = new Progress(0, context);
        //if (!crop) { let crop = "default"; }
        if (image.type == 'image/png' || image.type == 'image/jpeg' || image.type == 'image/bmp' || image.type == 'image/tiff' || image.type == 'image/gif') {
          try {

            let image = await Jimp.read(imageUrl);
            progressBar.setProgress(25);
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
                let defaultImage = image.resize(Jimp.AUTO, 1000);
                cropSettings = [Number(defaultImage.bitmap.width), Number(defaultImage.bitmap.height)];
                break;
            }
            let imageResize = await image.resize(Jimp.AUTO, cropSettings[1]).quality(70);
            progressBar.setProgress(50);
            let imageCrop = await imageResize.crop(Number((imageResize.bitmap.width-cropSettings[0])), Number((imageResize.bitmap.height-cropSettings[1])), Number(cropSettings[0]), Number(cropSettings[1]));
            progressBar.setProgress(75);
            let imageBase64 = await imageCrop.getBase64Async(Jimp.MIME_JPEG);
            progressBar.setProgress(100); //complete on this tick
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
