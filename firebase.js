import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyDEnvpPy7sjzE6Al1b7hxUdkiz_dc3KYF8",
  authDomain: "minglemart-236c3.firebaseapp.com",
  projectId: "minglemart-236c3",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };