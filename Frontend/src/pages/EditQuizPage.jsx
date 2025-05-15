// src/pages/EditQuizPage.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import api from '../utils/api';

export default function EditQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        //  Corrected endpoint (no double /api)
        const { data } = await api.get(`/quizzes/${id}`);
        if (data.creatorId !== userId) {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You are not the owner of this quiz.',
          });
          navigate('/quizzes');
        } else {
          setQuiz(data);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized or Not Found',
          text: 'You are not allowed to access this quiz.',
        });
        navigate('/quizzes');
      }
    })();
  }, [id, userId, navigate]);

  const handleChange = (field, value) => {
    setQuiz(q => ({ ...q, [field]: value }));
  };

  const handleQuestionChange = (idx, field, value) => {
    setQuiz(q => ({
      ...q,
      questions: q.questions.map((ques, i) =>
        i === idx ? { ...ques, [field]: value } : ques
      )
    }));
  };

  const save = async e => {
    e.preventDefault();
    try {
      const updatedQuiz = {
        ...quiz,
        creatorId: userId, //  include creatorId in update
      };

      await api.put(`/quizzes/${id}`, updatedQuiz);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Quiz updated successfully',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate(`/quizzes/${id}`);
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to update quiz',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  if (!quiz) return <p className="text-center mt-10 text-gray-500">Loading…</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Edit Quiz</h1>

      <form onSubmit={save} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={quiz.title}
            onChange={e => handleChange('title', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={quiz.description}
            onChange={e => handleChange('description', e.target.value)}
          />
        </div>

        {quiz.questions.map((q, i) => (
          <div key={i} className="border-t pt-6">
            <label className="block mb-2 font-semibold text-gray-700">
              Question {i + 1}
            </label>
            <input
              className="w-full border border-gray-300 rounded px-4 py-2 mb-3"
              value={q.text}
              onChange={e => handleQuestionChange(i, 'text', e.target.value)}
              required
            />
            {q.choices.map((c, ci) => (
              <div key={ci} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name={`correct-${i}`}
                  checked={q.correctIndex === ci}
                  onChange={() => handleQuestionChange(i, 'correctIndex', ci)}
                />
                <input
                  className="flex-1 border border-gray-300 rounded px-4 py-1"
                  value={c}
                  onChange={e => {
                    const newChoices = [...q.choices];
                    newChoices[ci] = e.target.value;
                    handleQuestionChange(i, 'choices', newChoices);
                  }}
                  required
                />
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
