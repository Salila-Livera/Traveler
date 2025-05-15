import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createQuiz } from '../services/quizService';
import Swal from 'sweetalert2';

export default function CreateQuizPage() {
  const { token, userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', choices: ['', '', '', ''], correctIndex: 0 },
  ]);

  const addQuestion = () => {
    setQuestions(qs => [
      ...qs,
      { text: '', choices: ['', '', '', ''], correctIndex: 0 },
    ]);
  };

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i !== idx ? q : { ...q, [field]: value }
      )
    );
  };

  const handleChoiceChange = (qIdx, cIdx, value) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i !== qIdx
          ? q
          : {
              ...q,
              choices: q.choices.map((c, j) => (j === cIdx ? value : c)),
            }
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dto = {
      title,
      description,
      creatorId: userId,
      questions: questions.map(q => ({
        text: q.text,
        choices: q.choices,
        correctIndex: q.correctIndex,
      })),
    };

    try {
      await createQuiz(dto);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Quiz created successfully!',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      navigate('/quizzes');
    } catch (err) {
      console.error(err);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: err.response?.data?.message || 'Failed to create quiz.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Create New Quiz</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quiz title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional description..."
          />
        </div>

        {/* Questions */}
        {questions.map((q, i) => (
          <fieldset key={i} className="border border-gray-200 p-4 rounded space-y-4 bg-gray-50">
            <legend className="font-semibold text-lg text-gray-700">Question {i + 1}</legend>

            <div>
              <label className="block mb-1">Question Text <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={q.text}
                onChange={e => handleQuestionChange(i, 'text', e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Enter question"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {q.choices.map((choice, j) => (
                <div key={j}>
                  <label className="block">Choice {j + 1} <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={choice}
                    onChange={e => handleChoiceChange(i, j, e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                    placeholder={`Enter choice ${j + 1}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block mb-1">Correct Answer</label>
              <select
                value={q.correctIndex}
                onChange={e => handleQuestionChange(i, 'correctIndex', +e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {[0, 1, 2, 3].map(n => (
                  <option key={n} value={n}>
                    Choice {n + 1}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
        ))}

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded"
          >
            + Add Question
          </button>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
