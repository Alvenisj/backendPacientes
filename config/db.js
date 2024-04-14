import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {});

    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default conectarDB;
