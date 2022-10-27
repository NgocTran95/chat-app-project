import { createContext, useContext, useMemo, useState } from 'react';
import { useFireStore } from '~/hooks/useFireStore';
import { AuthContext } from './AuthProvider';

export const AppContext = createContext();

function AppProvider({ children }) {
  const [isOpenAddRoom, setIsOpenAddRoom] = useState(false);
  const [isOpenInviteMember, setIsOpenInviteMember] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const { uid } = useContext(AuthContext);
  const roomsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid,
    };
  }, [uid]);
  const rooms = useFireStore('rooms', roomsCondition);

  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room.id === selectedRoomId) || {};
  }, [selectedRoomId, rooms]);

  const membersCondition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);
  const members = useFireStore('users', membersCondition);

  const messagesCondition = useMemo(() => {
    return {
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoomId
    }
  }, [selectedRoomId])
  const messages = useFireStore('messages', messagesCondition)
  return (
    <AppContext.Provider
      value={{
        rooms,
        isOpenAddRoom,
        setIsOpenAddRoom,
        selectedRoomId,
        setSelectedRoomId,
        selectedRoom,
        members,
        isOpenInviteMember,
        setIsOpenInviteMember,
        messages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
