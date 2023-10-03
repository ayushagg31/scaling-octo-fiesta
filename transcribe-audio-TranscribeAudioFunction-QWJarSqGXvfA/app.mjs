import { ytHandler } from "./yt-transcribe.mjs";
import AWS from "aws-sdk";
import "dotenv/config";

export const lambdaHandler = async (event, context) => {
  try {
    const sns = new AWS.SNS({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: process.env.REGION,
    });
    var params = event.Records[0].Sns.Message;
    const payload = JSON.parse(params);
    const transcription = await ytHandler(payload);
    const message = {
      Message: JSON.stringify(transcription),
      TopicArn: process.env.TRANSCRIPTION_RESPONSE_ARN,
    };

    const response = await sns.publish(message).promise();
    console.log("Message published successfully!", response);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
};
