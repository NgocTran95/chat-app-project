import { doc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '~/firebase/config';
import { useFireStore } from '~/hooks/useFireStore';
import { AuthContext } from './AuthProvider';

export const AppContext = createContext();

function AppProvider({ children }) {
  const [isOpenAddRoom, setIsOpenAddRoom] = useState(false);
  const [isOpenInviteMember, setIsOpenInviteMember] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const { uid } = useContext(AuthContext);

  // Reset selected room  after logout
  useEffect(() => {
    setSelectedRoomId('');
  }, [uid]);

  // Get rooms that user join
  const roomsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid,
    };
  }, [uid]);
  const rooms = useFireStore('rooms', roomsCondition);
  //  Get room to chat
  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room.id === selectedRoomId) || {};
  }, [selectedRoomId, rooms]);

  // Get members inside choosen room
  const membersCondition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);
  const members = useFireStore('users', membersCondition);
  const modifiedMembers = useMemo(() => {
    const onlineMembers = members.filter(member => member.status === 'Online')
    const awayMembers = members.filter(member => member.status === 'Away')
    const offlineMembers = members.filter(member => member.status === 'Offline')
    return [...onlineMembers, ...awayMembers, ...offlineMembers]
  }, [members])

  // Get messages inside choosen room
  const messagesCondition = useMemo(() => {
    return {
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoomId,
    };
  }, [selectedRoomId]);
  const messages = useFireStore('messages', messagesCondition);

  // Create this field because firebase does not support getting displayName, photo URL when login by Email
  // => get displayName from firestore (add doc when sign up) instead of from auth provider, photoURL set by default Avatar MUI component
  // Get current user
  const userCondition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: '==',
      compareValue: uid,
    };
  }, [uid]);
  const users = useFireStore('users', userCondition);
  // Get email user displayname
  const emailUserDisplayName = users[0]?.displayName;
  const userId = users[0]?.id

  // Set online status after login
  useEffect(() => {
    if (userId) {
      updateDoc(doc(db, 'users', userId), {
        status: 'Online'
      })
    }
  }, [userId])

  return (
    <AppContext.Provider
      value={{
        rooms,
        isOpenAddRoom,
        setIsOpenAddRoom,
        selectedRoomId,
        setSelectedRoomId,
        selectedRoom,
        modifiedMembers,
        isOpenInviteMember,
        setIsOpenInviteMember,
        messages,
        emailUserDisplayName,
        userId
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
