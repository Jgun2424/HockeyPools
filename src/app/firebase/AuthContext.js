'use client';

import React, { useContext, createContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, getDocs, where, collection, query, arrayUnion } from 'firebase/firestore';
import { auth } from './firebase';

// Create a context for authentication
const AuthContext = createContext();

// Authentication context provider component
export const AuthContextProvider = ({ children }) => {
    // State variables for user data and loading state
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function for user login
    const Login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    };

    // Function for user registration
    const signUp = async (email, password, username) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, { displayName: username });

            const userCollection = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userCollection, {
                email: email,
                username: username,
                userId: auth.currentUser.uid,
                poolsCreated: 0,
                poolsJoined: 0
            });

            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    };

    // Function for creating a new pool
    const createPool = async (poolName, poolDesc, poolPassword, poolScoring, poolID) => {
        try {
            const poolCollection = doc(db, 'pools', poolID);
            await setDoc(poolCollection, {
                poolName: poolName,
                poolDescription: poolDesc,
                poolPassword: poolPassword,
                poolOwner: auth.currentUser.uid,
                poolOwnerName: auth.currentUser.displayName,
                isPoolAcceptingMembers: true,
                poolScoringRules: poolScoring,
                poolID: poolID
            });

            const poolCollectionDoc = collection(db, 'pools', poolID, 'poolMembers');

            await setDoc(doc(poolCollectionDoc, auth.currentUser.uid), {
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName
            });


            const userDoc = doc(db, 'users', auth.currentUser.uid);

            await updateDoc(userDoc, {
                poolsJoined: userData.poolsJoined + 1,
                poolsJoinedList: arrayUnion(poolID)
            });
            

            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    };

    // Function for retrieving pool data
    const getPoolData = async (poolId) => {
      try {
          const poolQuery = query(collection(db, 'pools'), where('poolID', '==', poolId));
          const poolSnapshot = await getDocs(poolQuery);
          
          if (poolSnapshot.empty) {
              console.log('No matching documents.');
              return { success: false, error: 'No matching documents.' };
          }
          
          const poolData = poolSnapshot.docs[0].data();
          const poolMembersQuery = collection(db, 'pools', poolId, 'poolMembers');
          const poolMembersSnapshot = await getDocs(poolMembersQuery);
          const poolMembersList = poolMembersSnapshot.docs.map(doc => doc.data());
  
          return {
              poolName: poolData.poolName,
              poolDescription: poolData.poolDescription,
              poolPassword: poolData.poolPassword,
              poolOwner: poolData.poolOwner,
              poolOwnerName: poolData.poolOwnerName,
              isPoolAcceptingMembers: poolData.isPoolAcceptingMembers,
              poolMembers: poolMembersList,
              poolScoringRules: poolData.poolScoringRules,
              poolID: poolData.poolID,
              success: true
          };
      } catch (error) {
          console.error('Error fetching pool data:', error);
          return { success: false, error: error.message };
      }
  };
  
    // Function for user to join a pool
    const joinPool = async (poolId, joinerId) => {
        const poolCollectionDoc = collection(db, 'pools', poolId, 'poolMembers');

        const userDoc = doc(db, 'users', joinerId);

        await updateDoc(userDoc, {
            poolsJoined: userData.poolsJoined + 1,
            poolsJoinedList: arrayUnion(poolId)
        });

        await setDoc(doc(poolCollectionDoc, joinerId), {
            userId: joinerId,
            userName: auth.currentUser.displayName
        });

        return { success: true };
    };

    const getPoolMemberInfo = async (userId, poolId) => {
      const poolCollectionDoc = doc(db, 'pools', poolId, 'poolMembers', userId);
      const poolMemberData = await getDoc(poolCollectionDoc);

      return poolMemberData.data()
      
    }


    // Function to log out the user
    const logOut = () => {
        signOut(auth);
    }; 

    const sendPasswordReset = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    }


    const passwordReset = async (code, newPassword) => {
        try {
            await confirmPasswordReset(auth, code, newPassword);
            signOut(auth);
            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    }

    // Effect hook to manage authentication state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);

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
            };
            getUserInfo();
        });

        return () => unsubscribe();

    }, []);

    // Provide authentication context to child components
    return (
        <AuthContext.Provider value={{ user, Login, logOut, signUp, userData, loading, createPool, getPoolData, joinPool, getPoolMemberInfo, sendPasswordReset, passwordReset }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access authentication context
export const UserAuth = () => {
    return useContext(AuthContext);
};
