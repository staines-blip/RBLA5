const express = require('express');
const router = express.Router();
const workerController = require('../controllers/superadmin/workercontroller');

// Get all workers
router.get('/', workerController.getWorkers);

// Create a new worker
router.post('/', workerController.createWorker);

// Update an existing worker
router.put('/:id', workerController.updateWorker);

// Delete a worker by ID
router.delete('/:id', workerController.deleteWorker);

module.exports = router;
