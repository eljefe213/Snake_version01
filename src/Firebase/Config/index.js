import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const config = {
    apiKey: "AIzaSyBlKzUN1eGCNJnLdOFKpDaENlxYlx8A4hA",
    authDomain: "project-b8e76.firebaseapp.com",
    databaseURL: "https://project-b8e76.firebaseio.com",
    projectId: "project-b8e76",
    storageBucket: "project-b8e76.appspot.com",
    messagingSenderId: "820691775250",
    appId: "1:820691775250:web:a52aedf15b739f20708dcb"
};
firebase.initializeApp(config);

export default firebase;