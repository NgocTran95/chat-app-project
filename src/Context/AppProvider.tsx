import { AlertColor } from '@mui/material/Alert';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { createContext, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../firebase/config';
import { useFireStoreGetGroup } from '../hooks/useFireStoreGetGroup';
import { useFireStoreGetUsers } from '../hooks/useFireStoreGetUsers';
import { useFireStoreGetMessages } from '../hooks/useFireStoreGetMessages';
import { AuthContext } from './AuthProvider';
import type { fileType, messageType, shareMsgType } from '../hooks/useFireStoreGetMessages';
import type { groupType, condition } from '../hooks/useFireStoreGetGroup';
import type { userType } from '../hooks/useFireStoreGetUsers';

type Props = {
  children: JSX.Element;
};

type removeMemType = { displayName: string; uid: string };

type ToastMsgType = {
  open: boolean;
  vertical: 'top' | 'bottom';
  horizontal: 'right' | 'left' | 'center';
  message: string;
  severity: AlertColor | undefined;
};

export type totalFiles = {
  type: string;
  files: (fileType | undefined)[];
  totalSize: number;
  totalNum: number;
};

type AppContextType = {
  groups: groupType[];
  isOpenAddGroup: boolean;
  setIsOpenAddGroup: React.Dispatch<SetStateAction<boolean>>;
  isOpenEditGroup: boolean;
  setIsOpenEditGroup: React.Dispatch<SetStateAction<boolean>>;
  selectedGroupId: string;
  setSelectedGroupId: React.Dispatch<SetStateAction<string>>;
  selectedGroup: groupType;
  modifiedMembers: userType[];
  isOpenInviteMember: boolean;
  setIsOpenInviteMember: React.Dispatch<SetStateAction<boolean>>;
  isOpenRemoveMember: boolean;
  setIsOpenRemoveMember: React.Dispatch<SetStateAction<boolean>>;
  removeMember: removeMemType;
  setRemoveMember: React.Dispatch<SetStateAction<removeMemType>>;
  isOpenLeaveGroup: boolean;
  setIsOpenLeaveGroup: React.Dispatch<SetStateAction<boolean>>;
  isOpenLogOut: boolean;
  setIsOpenLogOut: React.Dispatch<SetStateAction<boolean>>;
  isOpenDeleteGroup: boolean;
  setIsOpenDeleteGroup: React.Dispatch<SetStateAction<boolean>>;
  shareMessage: shareMsgType;
  setShareMessage: React.Dispatch<SetStateAction<shareMsgType>>;
  messages: messageType[];
  emailUserDisplayName: string;
  toastMessage: ToastMsgType;
  setToastMessage: React.Dispatch<SetStateAction<ToastMsgType>>;
  userId: string;
  setUserId: React.Dispatch<SetStateAction<string>>;
  isAdmin: boolean;
  totalDocuments: totalFiles;
  totalImages: totalFiles;
  totalVideos: totalFiles;
};

const AppContextDefaultValue: AppContextType = {
  groups: [],
  isOpenAddGroup: false,
  setIsOpenAddGroup: () => {},
  isOpenEditGroup: false,
  setIsOpenEditGroup: () => {},
  selectedGroupId: '',
  setSelectedGroupId: () => {},
  selectedGroup: { admins: [], avatarURL: '', description: '', createAt: { seconds:  0}, name: '', id: '', members: [] },
  modifiedMembers: [],
  isOpenInviteMember: false,
  setIsOpenInviteMember: () => {},
  isOpenRemoveMember: false,
  setIsOpenRemoveMember: () => {},
  removeMember: { displayName: '', uid: '' },
  setRemoveMember: () => {},
  isOpenLeaveGroup: false,
  setIsOpenLeaveGroup: () => {},
  isOpenLogOut: false,
  setIsOpenLogOut: () => {},
  isOpenDeleteGroup: false,
  setIsOpenDeleteGroup: () => {},
  shareMessage: { id: '', displayName: '', type: '', name: '', size: 0, downloadURL: '' },
  setShareMessage: () => {},
  messages: [],
  emailUserDisplayName: '',
  toastMessage: { open: false, vertical: 'top', horizontal: 'right', message: '', severity: 'success' },
  setToastMessage: () => {},
  userId: '',
  setUserId: () => {},
  isAdmin: false,
  totalDocuments: { type: 'application', files: [], totalSize: 0, totalNum: 0 },
  totalImages: { type: 'image', files: [], totalSize: 0, totalNum: 0 },
  totalVideos: { type: 'video', files: [], totalSize: 0, totalNum: 0 },
};
export const AppContext = createContext(AppContextDefaultValue);

function AppProvider({ children }: Props) {
  const [userId, setUserId] = useState('');
  const [isOpenAddGroup, setIsOpenAddGroup] = useState<boolean>(false);
  const [isOpenEditGroup, setIsOpenEditGroup] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [isOpenInviteMember, setIsOpenInviteMember] = useState<boolean>(false);
  const [isOpenRemoveMember, setIsOpenRemoveMember] = useState<boolean>(false);
  const [removeMember, setRemoveMember] = useState<removeMemType>({ displayName: '', uid: '' });
  const [isOpenLeaveGroup, setIsOpenLeaveGroup] = useState<boolean>(false);
  const [isOpenDeleteGroup, setIsOpenDeleteGroup] = useState<boolean>(false);
  const [isOpenLogOut, setIsOpenLogOut] = useState<boolean>(false);
  const [shareMessage, setShareMessage] = useState<shareMsgType>({ id: '', displayName: '', type: '', name: '', size: 0, downloadURL: '' });
  const [toastMessage, setToastMessage] = useState<ToastMsgType>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    message: '',
    severity: 'success',
  });
  const { user } = useContext(AuthContext);
  // Set user offline when close tab
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      if (userId) {
        updateDoc(doc(db, 'users', userId), { status: { state: 'Offline', last_changed: serverTimestamp() } });
      }
    });
    return () => {
      window.removeEventListener('beforeunload', () => {
        if (userId) {
          updateDoc(doc(db, 'users', userId), { status: { state: 'Offline', last_changed: serverTimestamp() } });
        }
      });
    };
    // eslint-disable-next-line
  }, [userId]);

  // Get groups that user has joined
  const groupsCondition: condition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: user.uid,
    };
  }, [user.uid]);

  const groups: groupType[] = useFireStoreGetGroup(groupsCondition);
  // Reset selectedGroupId when member removed or leave
  useEffect(() => {
    if (!groups.map((group) => group.id).includes(selectedGroupId)) {
      setSelectedGroupId('');
    }
  }, [groups, selectedGroupId]);;
  
  //  Get group to chat
  const selectedGroup = useMemo(() => {
    return (
      groups.find((group) => group.id === selectedGroupId) || {
        admins: [],
        avatarURL: '',
        createAt: { seconds: 0 },
        description: '',
        members: [],
        name: '',
        id: '',
      }
    );
  }, [selectedGroupId, groups]);

  // Indentify user is admin or not
  const isAdmin: boolean = useMemo(() => {
    if (selectedGroup.admins.length) {
      return selectedGroup.admins.includes(user.uid);
    }
    return false;
  }, [selectedGroup, user.uid]);

  // Get members inside choosen group
  const membersCondition: condition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedGroup.members,
    };
  }, [selectedGroup.members]);
  const members: userType[] = useFireStoreGetUsers(membersCondition);

  // Arrange members depend on online/offline status
  const modifiedMembers = useMemo(() => {
    const onlineMembers = members.filter((member) => member.status.state === 'Online');
    const awayMembers = members.filter((member) => member.status.state === 'Away');
    const offlineMembers = members.filter((member) => member.status.state === 'Offline');
    return [...onlineMembers, ...awayMembers, ...offlineMembers];
  }, [members]);

  // Get messages inside choosen group
  const messagesCondition: condition = useMemo(() => {
    return {
      fieldName: 'groupId',
      operator: '==',
      compareValue: selectedGroupId,
    };
  }, [selectedGroupId]);
  const messages: messageType[] = useFireStoreGetMessages(messagesCondition);

  // Calculate the number and size of files
  const totalDocuments = useMemo(() => {
    const fileMessages = messages.filter((message) => message.type.split('/')[0] === 'application');
    const files = fileMessages.map((file) => file.application);
    const totalSize = fileMessages.reduce((total, file) => (total += file.application?.size || 0), 0);
    const totalNum = fileMessages.reduce((total, file) => (total += 1), 0);
    return { type: 'application', files, totalSize, totalNum };
  }, [messages]);

  const totalImages = useMemo(() => {
    const fileMessages = messages.filter((message) => message.type.split('/')[0] === 'image');
    const files = fileMessages.map((file) => file.image);
    const totalSize = fileMessages.reduce((total, file) => (total += file.image?.size || 0), 0);
    const totalNum = fileMessages.reduce((total, file) => (total += 1), 0);
    return { type: 'image', files, totalSize, totalNum };
  }, [messages]);

  const totalVideos = useMemo(() => {
    const fileMessages = messages.filter((message) => message.type.split('/')[0] === 'video');
    const files = fileMessages.map((file) => file.video);
    const totalSize = fileMessages.reduce((total, file) => (total += file.video?.size || 0), 0);
    const totalNum = fileMessages.reduce((total, file) => (total += 1), 0);
    return { type: 'video', files, totalSize, totalNum };
  }, [messages]);

  // Create this field because firebase does not support getting displayName, photo URL when login by Email
  // => get displayName from firestore (add doc when sign up) instead of from auth provider, photoURL set by default Avatar MUI component

  // Get current user
  const userCondition: condition = useMemo(() => {
    return {
      fieldName: 'uid',
      operator: '==',
      compareValue: user.uid,
    };
  }, [user.uid]);
  const currentUser: userType[] = useFireStoreGetUsers(userCondition);

  // Get email signup user displayname
  const emailUserDisplayName = currentUser[0]?.displayName;

  // Get current user id
  useEffect(() => {
    if (user.uid) {
      setUserId(currentUser[0]?.id);
    } else {
      setUserId('');
    }
  }, [currentUser, user.uid]);

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
        shareMessage,
        setShareMessage,
        messages,
        emailUserDisplayName,
        toastMessage,
        setToastMessage,
        userId,
        setUserId,
        isAdmin,
        totalDocuments,
        totalImages,
        totalVideos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
