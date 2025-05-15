import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function fetchQuizzes() {
  const res = await axios.get(`${API_URL}/api/quizzes`, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
  return res.data;
}

export async function fetchQuiz(id) {
  const res = await axios.get(`${API_URL}/api/quizzes/${id}`, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });
  return res.data;
}

export async function createQuiz(quizDto) {
  const { data } = await axios.post(
    `${API_URL}/api/quizzes`,
    quizDto,
    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
  );
  return data;
}


export async function updateQuiz(id, quizDto, token) {
  const res = await axios.put(
    `${API_URL}/api/quizzes/${id}`,
    quizDto,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
}

export async function deleteQuiz(id, token, userId) {
  await axios.delete(
    `${API_URL}/api/quizzes/${id}?creatorId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
}


