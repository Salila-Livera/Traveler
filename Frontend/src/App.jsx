// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }      from './context/AuthContext';
import Header                from './components/Header';

import RegisterPage          from './pages/RegisterPage';
import LoginPage             from './pages/LoginPage';
import QuizListPage          from './pages/QuizListPage';
import CreateQuizPage        from './pages/CreateQuizPage';
import QuizPage              from './pages/QuizPage';
import EditQuizPage          from './pages/EditQuizPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          {/* Public / Unprotected */}
          <Route path="/" element={<QuizListPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login"    element={<LoginPage  />} />

          {/* All routes now unprotected */}
          <Route path="/quizzes"          element={<QuizListPage />} />
          <Route path="/quizzes/create"   element={<CreateQuizPage />} />
          <Route path="/quizzes/:id"      element={<QuizPage />} />
          <Route path="/quizzes/:id/edit" element={<EditQuizPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
