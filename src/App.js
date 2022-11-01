import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import MessagePage from './pages/MessagePage';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddGroupModal from './components/AddGroupModal';
import InviteMemberModal from './components/InviteMemberModal';
import LogoutModal from './components/LogoutModal';
import EditGroupModal from './components/EditGroupModal';
import RemoveMemberModal from './components/RemoveMemberModal';
import LeaveGroupModal from './components/LeaveGroupModal';
import DeleteGroupModal from './components/DeleteGroupModal';

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
          <AddGroupModal />
          <EditGroupModal />
          <InviteMemberModal />
          <RemoveMemberModal />
          <LeaveGroupModal />
          <DeleteGroupModal />
          <LogoutModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
