import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubjectsPage from './pages/SubjectsPage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import UserDashboard from './pages/UserDashboard';
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import SubjectsManagement from './pages/admin/SubjectsManagement';
import NotesManagement from './pages/admin/NotesManagement';
import CreateNote from './pages/admin/CreateNote';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="subjects" element={<SubjectsPage />} />
              <Route path="subjects/:subjectId/notes" element={<NotesPage />} />
              <Route path="notes/:noteId" element={<NoteDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="dashboard" element={<UserDashboard />} />
              {/* Admin Routes */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<UsersManagement />} />
              <Route path="admin/subjects" element={<SubjectsManagement />} />
              <Route path="admin/notes" element={<NotesManagement />} />
              <Route path="admin/notes/create" element={<CreateNote />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;