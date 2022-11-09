import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MessagePage from './pages/MessagePage';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddGroupModal from './modals/AddGroupModal';
import InviteMemberModal from './modals/InviteMemberModal';
import LogoutModal from './modals/LogoutModal';
import EditGroupModal from './modals/EditGroupModal';
import RemoveMemberModal from './modals/RemoveMemberModal';
import LeaveGroupModal from './modals/LeaveGroupModal';
import DeleteGroupModal from './modals/DeleteGroupModal';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<MessagePage />} />
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
