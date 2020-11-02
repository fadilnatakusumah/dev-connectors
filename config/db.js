const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongo_uri');


const connectDB = async () => {
  console.log(`Connecting to MongoDB...`);
  
  try {
    await mongoose.connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB connected 🔊`);
  } catch (error) {
    console.error("connectDB -> error", error);
    process.exit(1) //Exit process with failure "1"
  }
}

module.exports = connectDB