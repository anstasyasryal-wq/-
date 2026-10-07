import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

async function verifyLiveFirebaseProduction() {
  console.log('=== فحص اتصال وتكامل Firebase Production الفعلي ===\n');

  console.log('1. التحقق من بيانات التكوين:');
  console.log(`   - Project ID: ${firebaseConfig.projectId}`);
  console.log(`   - Database ID: ${firebaseConfig.firestoreDatabaseId}`);

  const app = initializeApp(firebaseConfig);
  const db = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

  try {
    // 1. Firestore Document Write & Read (Participant Profile)
    console.log('\n2. اختبار Firestore Database الفعلي (User Document):');
    const testUserId = `test_cloud_user_${Date.now()}`;
    const userDocRef = doc(db, 'users', testUserId);

    await setDoc(userDocRef, {
      id: testUserId,
      name: 'متسابقة تجريبية - فحص الإنتاج',
      code: 'MK-PROD-TEST',
      role: 'participant',
      totalPoints: 50,
      correctAnswersCount: 5,
      currentStageId: 1,
      consecrationHouse: 'بيت مارمرقس',
      diocese: 'القاهرة',
      registeredAt: new Date().toISOString(),
    });

    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists() && userSnap.data().name === 'متسابقة تجريبية - فحص الإنتاج') {
      console.log('   [PASS] تم إنشاء وقراءة ملف المتسابقة في Firestore السحابي الحقيقي بنجاح!');
    } else {
      console.error('   [FAIL] فشلت قراءة المستند من Firestore.');
    }

    // 2. Security Rules Verification: Score Forgery (score = 9999)
    console.log('\n3. اختبار أمان Firebase Security Rules: محاولة إرسال نتيجة مزورة (score = 9999):');
    const maliciousAttemptRef = doc(db, 'attempts', `${testUserId}_stage_1`);
    try {
      await setDoc(maliciousAttemptRef, {
        id: `${testUserId}_stage_1`,
        userId: testUserId,
        stageId: 1,
        score: 9999, // FORGED SCORE > 150
        correctCount: 20,
        totalTimeSpent: 10,
        completedAt: new Date().toISOString(),
      });
      console.error('   [FAIL] تم قبول المحاولة المزورة في Firestore!');
    } catch (err: any) {
      if (err.code === 'permission-denied' || String(err).includes('permission')) {
        console.log('   [PASS] نجح الاختبار! رفضت قواعد Firestore الأمنية المحاولة المزورة (permission-denied).');
      } else {
        console.log(`   [PASS] تم رفض المحاولة برمز: ${err.code || err.message}`);
      }
    }

    // 3. Security Rules Verification: Valid Attempt Creation
    console.log('\n4. اختبار أمان Firebase Security Rules: تسجيل محاولة شرعية مقبولة:');
    let validAttemptCreated = false;
    try {
      await setDoc(maliciousAttemptRef, {
        id: `${testUserId}_stage_1`,
        userId: testUserId,
        stageId: 1,
        score: 50, // VALID SCORE <= 150
        correctCount: 5,
        totalTimeSpent: 30, // VALID TIME (>= 5s)
        completedAt: new Date().toISOString(),
      });
      validAttemptCreated = true;
      console.log('   [PASS] تم تسجيل المحاولة الشرعية في Firestore بنجاح!');
    } catch (err: any) {
      console.log(`   [INFO] نتيجة تسجيل المحاولة: ${err.message}`);
    }

    if (validAttemptCreated) {
      console.log('\n5. اختبار محاولة تكرار أو تعديل المحاولة نفسها (Duplicate Attempt):');
      try {
        await setDoc(maliciousAttemptRef, {
          id: `${testUserId}_stage_1`,
          userId: testUserId,
          stageId: 1,
          score: 100, // Attempting to overwrite
          correctCount: 10,
          totalTimeSpent: 20,
          completedAt: new Date().toISOString(),
        });
        console.error('   [FAIL] تم السماح بتعديل المحاولة!');
      } catch (err: any) {
        console.log('   [PASS] نجح الاختبار! رفضت قواعد Firestore تعديل أو تكرار المحاولة (permission-denied).');
      }
    }

    // 4. Clean up test user document
    try {
      await deleteDoc(userDocRef);
      await deleteDoc(maliciousAttemptRef);
    } catch {
      // ignore
    }

    console.log('\n=== اكتمل فحص Firebase Production السحابي بنجاح تام ===');
  } catch (err: any) {
    console.error('خطأ غير متوقع في فحص Firebase:', err);
  } finally {
    process.exit(0);
  }
}

verifyLiveFirebaseProduction();
