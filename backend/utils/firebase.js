import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: "AIzaSyDY03CzKUkUOG2pY9h_Px8AYJtRq-WLNzs",
  authDomain: "yarees-a69d1.firebaseapp.com",
  projectId: "yarees-a69d1",
  storageBucket: "yarees-a69d1.firebasestorage.app",
  messagingSenderId: "194021814907",
  appId: "1:194021814907:web:d0ebb8debb355d7ec228de",
  measurementId: "G-PMRLVN4Q0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadToFirebase = async (file) => {
  try {
    console.log('Starting file upload:', file.originalname);
    
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `products/${fileName}`);
    
    const metadata = {
      contentType: file.mimetype,
    };
    
    const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
    console.log('File uploaded successfully');
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL generated:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const deleteFromFirebase = async (fileUrl) => {
  try {
    const fileRef = ref(storage, decodeURIComponent(fileUrl));
    await deleteObject(fileRef);
    console.log('File deleted successfully');
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};
