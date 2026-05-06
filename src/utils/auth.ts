
import { 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "../firebase";

// GoogleAuthProvider was removed as per request to remove Google Sign In.


export const logout = async (): Promise<void> => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};
