import { createContext, useContext, useMemo } from 'react';
import { useFireStore } from '~/hooks/useFireStore';
import { AuthContext } from './AuthProvider';

export const AppContext = createContext();

function AppProvider({ children }) {
  const { uid } = useContext(AuthContext);
  const roomsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid,
    };
  }, [uid]);
  const rooms = useFireStore('rooms', roomsCondition);
  console.log(rooms);
  return <AppContext.Provider value={{ rooms }}>{children}</AppContext.Provider>;
}

export default AppProvider;
