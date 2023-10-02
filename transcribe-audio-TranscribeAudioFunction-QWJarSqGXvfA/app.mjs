import { ytHandler } from "./yt-transcribe.mjs";
import "dotenv/config";

export const lambdaHandler = async (event, context) => {
  try {
    console.log(event);
    // const { maxFileSizeMB, ytUrl, userEmail, collectionId } = event;
    const response = await ytHandler(event);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};
