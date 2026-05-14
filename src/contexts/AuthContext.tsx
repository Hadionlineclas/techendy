import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  googleProvider, 
  signInWithPopup, 
  firebaseSignOut,
  deleteUser,
  db,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  Timestamp,
  User
} from '@/lib/firebase';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch or create profile
        const profileRef = doc(db, 'users', user.uid);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as UserProfile);
        } else {
          // Create new profile
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'New User',
            photoURL: user.photoURL || '',
            role: user.email === 'hadionlineclas@gmail.com' ? 'admin' : 'user',
            createdAt: Timestamp.now(),
          };
          await setDoc(profileRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      // In some environments (like iframes), signInWithPopup might be blocked.
      // We'll try to detect the error and provide clear guidance.
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        toast.success("Identity verified. Welcome to Techendy.");
      }
    } catch (error: any) {
      console.error("Auth Error Type:", error.code);
      console.error("Auth Full Error:", error);
      
      if (error.code === 'auth/popup-blocked') {
        toast.error("Sign-in popup blocked. Please allow popups or open in a new tab.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        toast.info("Sign-in cancelled.");
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error("Domain unauthorized. Add " + window.location.hostname + " to 'Authorized Domains' in Firebase console.");
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error("Google Login not enabled. Enable it in the Firebase Console under Authentication > Sign-in method.");
      } else {
        toast.error(`Auth failed: ${error.message || 'Unknown error'}. Try opening in a new tab.`);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Securely logged out from Techendy.");
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) return;
    try {
      // First delete from Firestore
      await deleteDoc(doc(db, 'users', auth.currentUser.uid));
      // Then delete from Auth
      await deleteUser(auth.currentUser);
    } catch (error) {
      console.error("Delete Account Error:", error);
      throw error;
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signIn, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
