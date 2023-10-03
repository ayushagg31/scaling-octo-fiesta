import fs from "fs";
import ytdl from "ytdl-core";
import { AudioLoader } from "./audio-loader.mjs";

async function checkFileSize(filePath, maxFileSizeMB) {
  const stats = await fs.promises.stat(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeMB = fileSizeInBytes / (1024 * 1024);

  if (fileSizeMB < maxFileSizeMB) {
    return true; // allow
  } else {
    return false; // deny
  }
}

export const ytHandler = async (payload) => {
  const { maxFileSizeMB, ytUrl, userEmail, collectionId } = payload;
  const fileType = "mp3";
  const folderPath = "/tmp";
  const fileName = `${collectionId}.${fileType}`;
  const filePath = `${folderPath}/${fileName}`;

  try {
    const videoInfo = await ytdl.getInfo(ytUrl);
    const videoTitle = videoInfo?.videoDetails?.title;
    console.log(filePath, videoTitle);

    await new Promise((resolve, reject) => {
      const audioStream = ytdl(ytUrl, {
        filter: "audioonly",
        quality: "lowestaudio",
      });
      audioStream.pipe(fs.createWriteStream(filePath));

      audioStream.on("finish", () => {
        console.log(`Audio downloaded successfully - ${collectionId}`);
        resolve();
      });

      audioStream.on("error", (err) => {
        console.error(`Error downloading audio - ${userEmail}, `, err);
        reject(err);
      });
    });

    const isFileSizeWithinLimit = await checkFileSize(filePath, maxFileSizeMB);

    if (!isFileSizeWithinLimit) {
      return {
        status: 400,
        error: `Exceeding maximum allowed file limit`,
        collectionId,
      };
    }

    const transcript = await AudioLoader(filePath);

    return {
      status: 200,
      collectionName: videoTitle,
      collectionId,
      ytUrl,
      transcript,
      fileType,
      userEmail
    };
  } catch (err) {
    console.error(`Failed to transcribe - ${userEmail}`, err);
    return {
      status: 500,
      error: `Failed to transcribe: ${err.message}`,
      collectionId,
    };
  }
};
