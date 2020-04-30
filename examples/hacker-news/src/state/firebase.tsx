import firebase from 'firebase/app';
import 'firebase/database';

export const app = firebase.initializeApp(
  {
    databaseURL: 'https://hacker-news.firebaseio.com'
  },
  'hackernews'
);

export const db = app.database().ref('v0');
