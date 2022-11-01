import { doc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '~/firebase/config';
import { useFireStore } from '~/hooks/useFireStore';
import { AuthContext } from './AuthProvider';

export const AppContext = createContext();

function AppProvider({ children }) {
  const [isOpenAddGroup, setIsOpenAddGroup] = useState(false);
  const [isOpenEditGroup, setIsOpenEditGroup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [isOpenInviteMember, setIsOpenInviteMember] = useState(false);
  const [isOpenRemoveMember, setIsOpenRemoveMember] = useState(false);
  const [removeMember, setRemoveMember] = useState(null);
  const [isOpenLeaveGroup, setIsOpenLeaveGroup] = useState(false);
  const [isOpenDeleteGroup, setIsOpenDeleteGroup] = useState(false);
  const [isOpenLogOut, setIsOpenLogOut] = useState(false);
  const { uid } = useContext(AuthContext);

  // Reset selected group  after logout
  useEffect(() => {
    setSelectedGroupId('');
  }, [uid]);

  // Get groups that user join
  const groupsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid,
    };
  }, [uid]);
  const groups = useFireStore('groups', groupsCondition);
  //  Get group to chat
  const selectedGroup = useMemo(() => {
    return groups.find((group) => group.id === selectedGroupId) || {};
  }, [selectedGroupId, groups]);
  const isAdmin = useMemo(() => {
    if (!!selectedGroup.admins) {
      return selectedGroup.admins.includes(uid);
    }
  }, [selectedGroup, uid]);
  // Get members inside choosen group
  const membersCondition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedGroup.members,
    };
  }, [selectedGroup.members]);
  const members = useFireStore('users', membersCondition);
  const modifiedMembers = useMemo(() => {
    const onlineMembers = members.filter((member) => member.status === 'Online');
    const awayMembers = members.filter((member) => member.status === 'Away');
    const offlineMembers = members.filter((member) => member.status === 'Offline');
    return [...onlineMembers, ...awayMembers, ...offlineMembers];
  }, [members]);

  // Get messages inside choosen group
  const messagesCondition = useMemo(() => {
    return {
      fieldName: 'groupId',
      operator: '==',
      compareValue: selectedGroupId,
    };
  }, [selectedGroupId]);
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
  const userId = users[0]?.id;

  // Set online status after login
  useEffect(() => {
    if (userId) {
      updateDoc(doc(db, 'users', userId), {
        status: 'Online',
      });
    }
  }, [userId]);

  return (
    <AppContext.Provider
      value={{
        groups,
        isOpenAddGroup,
        setIsOpenAddGroup,
        isOpenEditGroup,
        setIsOpenEditGroup,
        selectedGroupId,
        setSelectedGroupId,
        selectedGroup,
        modifiedMembers,
        isOpenInviteMember,
        setIsOpenInviteMember,
        isOpenRemoveMember,
        setIsOpenRemoveMember,
        removeMember,
        setRemoveMember,
        isOpenLeaveGroup,
        setIsOpenLeaveGroup,
        isOpenLogOut,
        setIsOpenLogOut,
        isOpenDeleteGroup,
        setIsOpenDeleteGroup,
        messages,
        emailUserDisplayName,
        userId,
        isAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
