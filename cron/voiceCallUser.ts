import { Document } from "mongoose";
import User from "../models/user";
import Task from "../models/task";
import twilio from "twilio";

interface IUser extends Document {
  _id: string;
  phone_number: string;
  priority: number;
}

interface ITask extends Document {
  userId: string;
  priority: number;
  due_date: Date;
}

const accountSid = "AC6b86139986270ba9e10f9dcc8b837039";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const VoiceCallUser = async () => {
  try {
    const users = await User.find().sort({ priority: 1 });

    const usersNotPickedUp: string[] = [];

    for (const user of users) {
      const userTasks: ITask[] = await Task.find({ userId: user._id });

      const overdueTask: ITask | undefined = userTasks.find(
        (task) => task.priority === 0
      );

      if (overdueTask && !usersNotPickedUp.includes(user._id.toString())) {
        const callResult = await makeCall(user.phone_number);
        if (!callResult) {
          usersNotPickedUp.push(user._id.toString());
        }
      }
    }

    for (const userId of usersNotPickedUp) {
      const user: IUser | null = await User.findById(userId);
      if (user) {
        await makeCall(user.phone_number);
      }
    }

    console.log("Voice calls initiated successfully based on priority.");
  } catch (error) {
    console.error("Error initiating voice calls:", error);
  }
};

const makeCall = async (phoneNumber: string): Promise<boolean> => {
  try {
    const call = await client.calls.create({
      url: "https://handler.twilio.com/twiml/EHc246154ad77aca7d31a0e864a9a6443b",
      to: phoneNumber,
      from: "+16203613216",
    });

    console.log(`Voice call initiated for user ${phoneNumber}.`);
    console.log(call.sid);
    return true;
  } catch (error) {
    console.error("Error initiating voice call:", error);
    return false;
  }
};

export { VoiceCallUser };
