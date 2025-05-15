import React, { useEffect, useState, useContext } from 'react';
import { fetchQuizzes, deleteQuiz } from '../services/quizService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId, token } = useContext(AuthContext);

  useEffect(() => {
    fetchQuizzes()
      .then((data) => {
        setQuizzes(data);
      })
      .catch((err) => {
        console.error("Failed to fetch quizzes:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleQuizClick = (quizId) => {
    navigate(`/quizzes/${quizId}`);
  };

  const handleCreateQuiz = () => {
    navigate('/quizzes/create');
  };

  const handleEdit = (quizId) => {
    navigate(`/quizzes/${quizId}/edit`);

  };

  const handleDelete = async (quizId) => {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'This quiz will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (confirmed.isConfirmed) {
      try {
        await deleteQuiz(quizId, token, userId); 
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Quiz deleted',
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Failed to delete quiz',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };
  

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading quizzes...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600">Available Quizzes</h2>
        <button
          onClick={handleCreateQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          + Create Quiz
        </button>
      </div>

      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-100 transition duration-300"
            >
              <div onClick={() => handleQuizClick(quiz.id)} className="cursor-pointer">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h4>
                <p className="text-gray-600 text-sm">{quiz.description}</p>
              </div>

              {/*  Only show buttons if current user is the quiz creator */}
              {String(quiz.creatorId) === String(userId) && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(quiz.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No quizzes found.</p>
      )}
    </div>
  );
}

export default QuizListPage;
