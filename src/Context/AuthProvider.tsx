import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
export const AuthContext = React.createContext();
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedRoom,setSelectedRoom]=useState(null);
  const [roomsMember,setRoomsMember]=useState([]);
  const [visibleInviteMember,setVisibleInviteMember]=useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if(!user) return;
  setSelectedRoom(null);
}, [user?.uid]);

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
        setTimeout(() => {
             if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({ displayName, email, uid, photoURL });
        navigate('/');
        
      } else {
        setUser(null);
        navigate('/login');
      }
      setIsLoading(false);
        }, 0);
     
    });

    return () => unsubscribe();
  }, [navigate]);
  
  useEffect(() => {
  if (!selectedRoom?.id) return;

  const roomRef = doc(db, "rooms", selectedRoom.id);

  const unsubscribe = onSnapshot(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      setSelectedRoom({
        id: snapshot.id,
        ...snapshot.data(),
      });
    }
  });

  return () => unsubscribe();
}, [selectedRoom?.id]);



  return (
    <AuthContext.Provider value={{ user, visible, setVisible,selectedRoom,setSelectedRoom ,roomsMember,setRoomsMember,visibleInviteMember,setVisibleInviteMember }}>
      {isLoading ? <Spin /> : children}
    </AuthContext.Provider>
  );
}
