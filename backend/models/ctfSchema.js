const mongoose = require('mongoose');

const CtfRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true, 
  },
  company: {
    type: String,
    required: true, 
  },
  role: {
    type: String,
    required: true, 
  },
  requestType: {
    type: String,
    required: true, 
  },
  scenarioDescription: {
    type: String,
    required: true, 
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
  },
  shortlistedCandidates: {
    type: String,
    required: true, 
  },
}, { timestamps: true });

module.exports = mongoose.model('ctfSchema', CtfRequestSchema);