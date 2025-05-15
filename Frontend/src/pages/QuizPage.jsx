// src/pages/QuizPage.jsx
import { useState, useEffect } from 'react';
import { fetchQuiz } from '../services/quizService';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuiz(id).then(setQuiz);
  }, [id]);

  const handleSelect = (qIdx, choiceIdx) => {
    if (!submitted) {
      setAnswers(prev => ({ ...prev, [qIdx]: choiceIdx }));
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: `You scored ${correct} / ${quiz.questions.length}`,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const goToAllQuizzes = () => {
    navigate('/quizzes');
  };

  if (!quiz) return <div className="p-6 text-center text-gray-600">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">{quiz.title}</h2>

      <div className="space-y-8">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white">
            <p className="text-lg font-semibold text-gray-800 mb-3">
              {idx + 1}. {q.text}
            </p>

            <div className="space-y-2">
              {q.choices.map((choice, ci) => {
                const isSelected = answers[idx] === ci;
                const isCorrect = submitted && ci === q.correctIndex;
                const isWrong = submitted && isSelected && ci !== q.correctIndex;

                let btnStyle = 'bg-white border-gray-300 hover:bg-gray-100';
                if (isSelected) btnStyle = 'bg-indigo-100 border-indigo-400';
                if (isCorrect) btnStyle = 'border-green-500 bg-green-100 text-green-900';
                if (isWrong) btnStyle = 'border-red-500 bg-red-100 text-red-900';

                return (
                  <button
                    key={ci}
                    disabled={submitted}
                    onClick={() => handleSelect(idx, ci)}
                    className={`w-full text-left px-4 py-2 border rounded transition ${btnStyle}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="mt-8 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow-md"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="text-xl text-center text-gray-800 font-medium">
            Final Score: <span className="font-bold">{score}</span> / {quiz.questions.length}
          </div>
          <button
            onClick={goToAllQuizzes}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
          >
            Go to All Quizzes
          </button>
        </div>
      )}
    </div>
  );
}
