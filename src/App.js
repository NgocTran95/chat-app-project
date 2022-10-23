import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import MessagePage from './pages/MessagePage';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<MessagePage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
