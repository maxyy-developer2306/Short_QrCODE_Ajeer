import Worker from '../models/Worker.js';

// Get All Workers
export const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Worker (View)
export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Worker
export const createWorker = async (req, res) => {
  try {
    const newWorker = await Worker.create(req.body);
    res.status(201).json(newWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Worker (Edit)
export const updateWorker = async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedWorker) return res.status(404).json({ message: 'Worker not found' });
    res.json(updatedWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Worker
export const deleteWorker = async (req, res) => {
  try {
    const deletedWorker = await Worker.findByIdAndDelete(req.params.id);
    if (!deletedWorker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Worker (Public for verification page)
export const getWorkerPublic = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Active / Hidden Status
export const toggleWorkerStatus = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    worker.status = worker.status === 'active' ? 'hidden' : 'active';
    await worker.save();
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};