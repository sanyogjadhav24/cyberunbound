const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const CtfRequest = require('../models/ctfSchema');

const router = express.Router();

// Create GridFS bucket
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

// Configure multer to store files in memory (not on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST request handler
router.post('/ctf', upload.single('file'), async (req, res) => {
  try {
    const {
      email, fullName, company, role, requestType,
      scenarioDescription, shortlistedCandidates
    } = req.body;

    let fileId = null;
    
    // If file exists, store it in GridFS
    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;
      
      // Create upload stream
      const uploadStream = gfs.openUploadStream(originalname, {
        contentType: mimetype
      });
      
      // Store file and get its ID
      uploadStream.end(buffer);
      fileId = uploadStream.id;
    }

    const formData = new CtfRequest({
      email, 
      fullName, 
      company, 
      role, 
      requestType,
      scenarioDescription, 
      shortlistedCandidates,
      fileId // Store the GridFS file ID instead of URL
    });

    await formData.save();
    res.status(200).json({ success: true, message: "Form submitted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Optional: Endpoint to retrieve files
router.get('/file/:id', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfs.openDownloadStream(fileId);
    
    downloadStream.on('error', () => {
      res.status(404).json({ error: 'File not found' });
    });
    
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;