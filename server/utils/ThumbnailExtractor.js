const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const ThumbnailExtractor = (videoPath, id) => {
  const resolvedVideoPath = path.resolve(__dirname, "..", videoPath);
  const thumbnailsFolder = path.resolve(__dirname, "../thumbnails/temp");
  const thumbnailFilePath = path.resolve(thumbnailsFolder, `${id}.png`);

  return new Promise((resolve, reject) => {
    ffmpeg(resolvedVideoPath)
      .screenshots({
        count: 1,
        timemarks: ["3"],
        folder: thumbnailsFolder,
        filename: `${id}.png`,
      })
      .on("end", () => {
        const thumbnailURL = `thumbnails/temp/${id}.png`;
        resolve(thumbnailURL);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

module.exports = ThumbnailExtractor;
