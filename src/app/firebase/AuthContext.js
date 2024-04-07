'use client'

import React, { useContext, createContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, getDocs, where, collection, query } from 'firebase/firestore';
import { auth } from './firebase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const Login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  const signUp = async (email, password, username) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: username
      });

      const userCollection = doc(db, 'users', auth.currentUser.uid);

      await setDoc(userCollection, {
        email: email,
        username: username,
        userId: auth.currentUser.uid,
        poolsCreated: 0
      });
      
      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }
  }

  const createPool = async (poolName, poolDesc, poolPassword, poolScoring, poolID) => {
    try {
      const poolCollection = doc(db, 'pools', poolName);

      await setDoc(poolCollection, {
        poolName: poolName,
        poolDescription: poolDesc,
        poolPassword: poolPassword,
        poolOwner: auth.currentUser.uid,
        isPoolAcceptingMembers: true,
        poolMembers: [auth.currentUser.uid],
        poolScoringRules: poolScoring,
        poolID: poolID
      });

      const userCollection = doc(db, 'users', auth.currentUser.uid);

      await updateDoc(userCollection, {
        poolsCreated: userData.poolsCreated + 1
      });

      return { success: true };
    } catch (error) {
      console.log(error);
      return { success: false, error: error.message };
    }

  }

  const getPoolData = async (poolId) => {

    const poolCollection = query(collection(db, 'pools'), where('poolID', '==', poolId));
    const poolData = await getDocs(poolCollection);
    const Data = poolData.docs[0].data();
    
    console.log(Data);
    return Data;

    
  }




  const logOut = () => {
    signOut(auth)
  }   


useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    setUser(currentUser)

    if (!currentUser) {
      setLoading(false);
      return;
    } // break out early if no user
    
    const userDoc = doc(db, 'users', currentUser?.uid);

    const getUserInfo = async () => {
        const userDataDB = await getDoc(userDoc);

        if (userDataDB.exists()) {
            const userData = userDataDB.data();
            setUserData(userData);
            setLoading(false);
        } else {
            console.log('Document does not exist');
        }
    }
    getUserInfo()
  });

  return () => unsubscribe();

}, []);

return (
  <AuthContext.Provider value={{ user, Login, logOut, signUp, userData, loading, createPool, getPoolData }}>
    {children}
  </AuthContext.Provider>
);
}

export const UserAuth = () => {
    return useContext(AuthContext);
}