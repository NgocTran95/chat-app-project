import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB8io5-KXfr5uGfaogQzBaGi6J9ZPA85Ws',
  authDomain: 'realtime-chat-app-b36cb.firebaseapp.com',
  projectId: 'realtime-chat-app-b36cb',
  storageBucket: 'realtime-chat-app-b36cb.appspot.com',
  messagingSenderId: '739793988288',
  appId: '1:739793988288:web:50c587ff39e2bda689db25',
  measurementId: 'G-YW8X8W9MR1',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app)
const db = getFirestore(app)

connectAuthEmulator(auth, 'http://localhost:9099')
connectFirestoreEmulator(db, 'localhost', 8080);

export { auth, db };
