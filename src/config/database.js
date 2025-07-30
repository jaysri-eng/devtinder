const mongoose = require("mongoose");

const connectDb = async () => {
    await mongoose.connect(
      "mongodb+srv://jayanthsrinivasan1011:7Fycvb0oGKthXcZs@namastedev.vdtesks.mongodb.net/devTinder?retryWrites=true&w=majority&appName=namastedev"
    );
}

module.exports = connectDb;
