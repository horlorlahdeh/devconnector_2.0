const mogoose = require('mongoose');
// To get global variable in this case MongoURI
const config = require('config');
// Store MongoURI in a variable called db
const db = config.get('mongoURI');

// Define a function that connects to MongoDB in a try/catch block connect() is a mongoose method.
const connectDB = async () => {
  try {
    await mogoose.connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true, useFindAndModify: false
    });
    console.log('MongoDB database connection established successfully');
  } catch (err) {
    console.error(err.message);
    // Exit Process with failure
    process.exit(1);
  }
};

// Export the function => connectDB to use it in server.js
module.exports = connectDB;
