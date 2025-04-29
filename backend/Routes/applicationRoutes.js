const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const upload = require('../middlewares/uploadCV');

// CREATE: Apply for a job
router.post('/apply', upload.single('cv'), async (req, res) => {
  try {
    const { email, jobId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'CV file is required' });
    }

    const application = new Application({
      email,
      job: jobId,
      cv: req.file.filename, // store only filename
    });

    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL: All applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().populate('job'); // Optional: populate job details
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ONE: Get one application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete an application
router.delete('/:id', async (req, res) => {
  try {
    
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);
    
    if (!deletedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
