import mongoose from "mongoose";
import "dotenv/config";

const Database = async () => {
  try {
    const Db = await mongoose.connect(process.env.MONGOURI);
    console.log("Connected to server");
  } catch (error) {
    console.log("An error occured:", error.message);
  }
};

export default Database;
