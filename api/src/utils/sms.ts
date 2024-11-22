import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { env } from "process";

const snsClient = new SNSClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const sendSms = async (phoneNumber: string, message: string) => {
  const command = new PublishCommand({
    Message: message,
    PhoneNumber: phoneNumber,
  });
  const results = await snsClient.send(command);
  return results;
};

export const sendRegistrationSms = async (
  phoneNumber: string,
  verificationCode: number
) => {
  return await sendSms(
    phoneNumber,
    `Your verification code is ${verificationCode}`
  );
};
