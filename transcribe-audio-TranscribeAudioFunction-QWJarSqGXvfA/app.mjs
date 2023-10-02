import { ytHandler } from "./yt-transcribe.mjs";
import "dotenv/config";

export const lambdaHandler = async (event, context) => {
  try {
    var params = event.Records[0].Sns.Message;
    const payload = JSON.parse(params);
    // const { maxFileSizeMB, ytUrl, userEmail, collectionId } = event;
    const response = await ytHandler(payload);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};
