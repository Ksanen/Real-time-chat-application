import mongoose from "mongoose";
const connectDb = async () => {
  try {
    console.log(process.env.MONGO);
    await mongoose.connect(process.env.MONGO);
    console.log("connected");
  } catch (e) {
    console.error(e);
  }
};
export default connectDb;
