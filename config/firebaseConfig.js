var admin = require("firebase-admin");

var serviceAccount = require("../config/firebaseServiceAccountKey.json");

const firebaseConfig = {
  apiKey: "AIzaSyDJUw9whbRjVpjAA9sZQi9qqIn4N9GRoDg",
  authDomain: "martinventory-a8ad4.firebaseapp.com",
  projectId: "martinventory-a8ad4",
  storageBucket: "martinventory-a8ad4.appspot.com",
  messagingSenderId: "741725233679",
  appId: "1:741725233679:web:57718b0af6340110c2f97a",
  credential: admin.credential.cert(serviceAccount)
};


const app = admin.initializeApp(firebaseConfig);
const auth = admin.auth()
module.exports = {
  auth
} 
