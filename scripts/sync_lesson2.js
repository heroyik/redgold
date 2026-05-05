import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'redgold-42d27';

initializeApp({
  projectId: projectId
});

const db = getFirestore();

async function sync() {
  try {
    const filePath = './data/lesson2.json';
    const data = JSON.parse(await readFile(filePath, 'utf8'));
    
    console.log(`Syncing ${filePath} to Firestore...`);
    
    // Use the lessonId as the document ID or 'lesson' + lessonId
    const docId = `lesson${data.lessonId}`;
    await db.collection('lessons').doc(docId).set(data);
    
    console.log(`Successfully synced ${docId} to Firestore!`);
  } catch (error) {
    console.error('Error syncing to Firestore:', error);
    process.exit(1);
  }
}

sync();
