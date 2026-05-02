import { db, auth } from "./firebase";

export const testFirebase = () => {
  console.log("🚀 Firebase 테스트 시작...");
  
  // 1. DB 객체 확인
  if (db) {
    console.log("✅ Firestore 인스턴스: 성공!");
  } else {
    console.error("❌ Firestore 인스턴스: 실패!");
  }

  // 2. Auth 객체 확인
  if (auth) {
    console.log("✅ Auth 인스턴스: 성공!");
  } else {
    console.error("❌ Auth 인스턴스: 실패!");
  }

  console.log("🏁 테스트 완료!");
};