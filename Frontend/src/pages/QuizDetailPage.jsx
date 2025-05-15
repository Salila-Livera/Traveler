// src/pages/QuizDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Swal from 'sweetalert2';

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    api.get(`/quizzes/${id}`).then(r => setQuiz(r.data));
  }, [id]);

  const handleChoiceSelect = (questionId, selectedIdx, correctIdx, choiceText) => {
    setSelected(prev => ({ ...prev, [questionId]: selectedIdx }));

    const isCorrect = selectedIdx === correctIdx;

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: isCorrect ? 'success' : 'error',
      title: isCorrect ? 'Correct!' : `Wrong!`,
      text: isCorrect ? '' : `You selected: ${choiceText}`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  if (!quiz) return <div className="text-center mt-10 text-gray-600">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">{quiz.title}</h1>
        <p className="text-gray-700">{quiz.description}</p>
      </div>

      {quiz.questions.map((q, index) => (
        <div key={q.id} className="p-6 border border-gray-200 rounded-xl shadow-sm bg-white space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">{index + 1}. {q.text}</h2>

          <ul className="space-y-3">
            {q.choices.map((choice, idx) => {
              const isSelected = selected[q.id] === idx;
              const isCorrect = q.correctIndex === idx;
              const wasAnswered = selected[q.id] != null;

              let btnColor = 'bg-gray-100 hover:bg-gray-200';
              if (wasAnswered && isSelected) {
                btnColor = isCorrect ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900';
              }

              return (
                <li key={idx}>
                  <button
                    onClick={() =>
                      handleChoiceSelect(q.id, idx, q.correctIndex, choice)
                    }
                    disabled={wasAnswered}
                    className={`w-full text-left px-4 py-2 rounded border border-gray-300 transition ${btnColor}`}
                  >
                    {choice}
                  </button>
                </li>
              );
            })}
          </ul>

          {selected[q.id] != null && (
            <p className="text-sm text-gray-600 italic">
              Correct answer: <span className="font-semibold">{q.choices[q.correctIndex]}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
