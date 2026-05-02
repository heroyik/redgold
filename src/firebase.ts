
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Firebase 설정 (환경 변수에서 가져옴)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import도.env.VITE_FIREBASE_APP_ID
};

// Firebase 초기화
const app: FirebaseApp = initializeApp(firebaseConfig);

// 서비스 인스턴스 생성
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// 외부 사용을 위한 export
export { app, db, auth };
 { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// TODO: Firebase Console에서 발급받은 설정값을 여기에 붙여넣으세요.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authdomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
YOUR_PROJECT_ID",
으로
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase 초기화
const app: FirebaseApp = initializeApp(firebaseConfig);

// 사용할 서비스들 초기화
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// 다른 파일에서 사용할 수 있도록 export
export { app, db, auth };