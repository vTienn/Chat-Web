import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, Timestamp , deleteDoc } from 'firebase/firestore';


export function formatCreatedAt(createdAt?: Timestamp) {
  if (!createdAt) return "";

  const date = createdAt.toDate();

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
export const delDocument = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    console.log("Deleted message:", id);
  } catch (error) {
    console.error("Delete failed:", error);
  }
};


export const addDocument = async (collectionName: string, data: any) => {
  try {
   const docRef=await addDoc(collection(db,collectionName), {
    ...data,
    createAt:serverTimestamp(),
   });
  

    console.log("Document added with ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

export const addNewUserToFirestore = async (user: any, additionalInfo: any) => {
  try {
        await setDoc(doc(db, 'users', user.uid), {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid,
            providerId: additionalInfo.providerId,
            keyWords: generateKeywords(user.displayName),
        },{merge: true});
    
  } catch (error) {
    console.error("Error adding new user to Firestore", error);
  }
};
export const generateKeywords = (displayName) => {
  const name = displayName.split(' ').filter(Boolean);
  const length = name.length;

  let flagArray = new Array(length).fill(false);
  let result = [];
  let stringArray = [];

  const createKeywords = (str) => {
    const arr = [];
    let cur = '';
    str.split('').forEach((ch) => {
      cur += ch;
      arr.push(cur);
    });
    return arr;
  };

  function findPermutation(k) {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true;
        result[k] = name[i];

        if (k === length - 1) stringArray.push(result.join(' '));

        findPermutation(k + 1);

        flagArray[i] = false;
      }
    }
  }

  findPermutation(0);

 
  let keywords = stringArray.flatMap((fullName) => createKeywords(fullName));

  
  keywords = [...new Set(keywords)];

  return keywords;
};
