import express from 'express';
import {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  toggleWorkerStatus,
  getWorkerPublic,
} from '../controllers/workerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for verification page
router.route('/public/:id').get(getWorkerPublic);

// Protected routes
router.route('/').get(protect, getWorkers).post(protect, createWorker);
router.route('/:id').get(protect, getWorkerById).put(protect, updateWorker).delete(protect, deleteWorker);
router.patch('/:id/status', protect, toggleWorkerStatus);

export default router;