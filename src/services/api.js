import axios from 'axios';

const API_BASE_URL = 'https://quest-backend-4w5k.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getQuestions = async () => {
  const response = await api.get('/questions');
  return response.data;
};

export const createQuestion = async (questionData) => {
  const response = await api.post('/questions', questionData);
  return response.data;
};

export const updateQuestion = async (id, questionData) => {
  const response = await api.put(`/questions/${id}`, questionData);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await api.post('/upload/document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const runCode = async (codeData) => {
  const response = await api.post('/compiler/run', codeData);
  return response.data;
};