import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserProfile, FirebaseConversion } from './types';

export class FirebaseService {
  // Autenticação
  static async registerUser(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualizar perfil com displayName
      await updateProfile(user, { displayName });

      // Criar perfil do usuário no Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        favorites: ['BTC', 'ETH'], // Favoritos padrão
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      return {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || displayName,
        photoURL: user.photoURL || undefined,
        createdAt: new Date()
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async loginUser(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || undefined,
        photoURL: user.photoURL || undefined,
        createdAt: new Date()
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Erro ao fazer logout');
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    console.log('Setting up Firebase auth state listener...');
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      console.log('Firebase auth state changed:', firebaseUser);
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date()
        };
        console.log('Created user object:', user);
        callback(user);
      } else {
        console.log('No user, calling callback with null');
        callback(null);
      }
    });
  }

  // Perfil do usuário
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }

  static async updateUserFavorites(uid: string, favorites: string[]): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        favorites,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
      throw error;
    }
  }

  // Conversões
  static async saveConversion(conversion: Omit<FirebaseConversion, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'conversions'), {
        ...conversion,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar conversão:', error);
      throw error;
    }
  }

  static async getUserConversions(userId: string): Promise<FirebaseConversion[]> {
    try {
      const q = query(
        collection(db, 'conversions'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const conversions: FirebaseConversion[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        conversions.push({
          id: doc.id,
          userId: data.userId,
          fromSymbol: data.fromSymbol,
          toSymbol: data.toSymbol,
          amount: data.amount,
          result: data.result,
          rate: data.rate,
          date: data.date.toDate()
        });
      });
      
      return conversions;
    } catch (error) {
      console.error('Erro ao buscar conversões:', error);
      return [];
    }
  }

  static async deleteConversion(conversionId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'conversions', conversionId));
    } catch (error) {
      console.error('Erro ao deletar conversão:', error);
      throw error;
    }
  }

  static async clearUserConversions(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'conversions'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Erro ao limpar conversões:', error);
      throw error;
    }
  }

  // Utilitários
  private static getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'Email já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'auth/invalid-email':
        return 'Email inválido';
      default:
        return 'Erro de autenticação';
    }
  }
} 