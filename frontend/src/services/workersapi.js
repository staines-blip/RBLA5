import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workers';

// Fetch all workers
export const getWorkers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new worker
export const addWorker = async (workerData) => {
  const response = await axios.post(API_URL, workerData);
  return response.data;
};

// Update an existing worker
export const updateWorker = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

// Delete a worker by ID
export const deleteWorker = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
