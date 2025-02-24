const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phoneNo: { type: String, required: true },
    // Include email if you plan to use it in the front end
    email: { type: String },
    address: { type: String, required: true },
    salary: { type: Number, required: true },
    role: { type: String, required: true },
    unit: { type: String, required: true },
    aadharNo: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Worker', workerSchema);
