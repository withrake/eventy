import firebase from 'firebase/app'; 
import 'firebase/firestore'; 
import 'firebase/database'; //we will use this for the chat
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAvXu5DBgU1MAd38KtTjJvRF8yVjDFTZyg", //this key is needed to access this app
    authDomain: "eventy-55e9c.firebaseapp.com",
    databaseURL: "https://eventy-55e9c.firebaseio.com",
    projectId: "eventy-55e9c",
    storageBucket: "eventy-55e9c.appspot.com",
    messagingSenderId: "379242986888",
    appId: "1:379242986888:web:4896b9e9cee36f48070e3d"
}

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;