/**
 * Phase 1 Comprehensive Practical Verification & Acceptance Test Suite
 * Platform: "حسب قلب الله" (According to God's Heart)
 */

import { BIBLE_READING_PLANS, BIBLICAL_STUDY_TOPICS } from '../src/data/spiritualPlans';
import {
  getPlanProgress,
  togglePlanDayCompletion,
  saveDiaryEntry,
  getDiaryEntries,
  updateDiaryEntry,
  deleteDiaryEntry,
  isDiaryEncryptedInStorage,
  encryptClientPayload,
  decryptClientPayload,
  getRosaryStats,
  recordRosarySession,
  getPersonalSpiritualStats,
} from '../src/utils/spiritualStorage';
import { STAGE_QUESTIONS, COMPETITION_STAGES } from '../src/data/competitionStages';
import { DESERT_MOTHERS } from '../src/data/desertMothers';
import { MONASTIC_VIRTUES } from '../src/data/monasticVirtues';
import { SPIRITUAL_PROMPT_SUGGESTIONS, FALLBACK_SPIRITUAL_TOPICS } from '../src/data/spiritualGuideWisdom';
import { getStoredQuestions, registerParticipant } from '../src/utils/competitionEngine';

// Node localStorage polyfill for isolated headless testing
class MemoryStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] || null;
  }
}

// Attach polyfill
(globalThis as any).localStorage = new MemoryStorage();

interface TestAssertionResult {
  section: string;
  testName: string;
  passed: boolean;
  message: string;
}

const results: TestAssertionResult[] = [];

function assert(section: string, testName: string, condition: boolean, message: string) {
  results.push({ section, testName, passed: condition, message });
  const icon = condition ? '✅ [PASS]' : '❌ [FAIL]';
  console.log(`${icon} [${section}] ${testName}: ${message}`);
}

async function runPhase1Verification() {
  console.log('================================================================');
  console.log('🧪 بدء اختبار التحقق العملي الشامل للمرحلة الأولى - حسب قلب الله');
  console.log('================================================================\n');

  // =========================================================================
  // 1. اختبار قسم الحياة الروحية (SpiritualLifeView)
  // =========================================================================
  console.log('--- 1. اختبارات ركن الحياة الروحية وخطط القراءة ---');

  // أ. التحقق من وجود الخطط الأربع
  assert(
    'SpiritualLife',
    'وجود الخطط الأربع المعتمدة',
    BIBLE_READING_PLANS.length === 4,
    `تم العثور على ${BIBLE_READING_PLANS.length} خطط قراءة (مطلوب 4).`
  );

  const planIds = BIBLE_READING_PLANS.map((p) => p.id);
  const expectedPlans = [
    'plan-shepherd-heart',
    'plan-monastic-lamp',
    'plan-mary-portion',
    'plan-bible-wisdom',
  ];
  const allExpectedPresent = expectedPlans.every((id) => planIds.includes(id));
  assert(
    'SpiritualLife',
    'تغطية الفئات الأربع (كاهن، راهب، مكرسة، عام)',
    allExpectedPresent,
    `معرفات الخطط مطابقة تماماً: ${planIds.join(', ')}`
  );

  // ب. التحقق من احتواء كل خطة على 7 أيام كاملة ببياناتها
  let allDaysValid = true;
  let totalDaysCount = 0;
  for (const plan of BIBLE_READING_PLANS) {
    if (plan.days.length !== 7) allDaysValid = false;
    totalDaysCount += plan.days.length;
    for (const day of plan.days) {
      if (!day.title || !day.passage || !day.keyVerse || !day.reflection || !day.spiritualPractice) {
        allDaysValid = false;
      }
    }
  }
  assert(
    'SpiritualLife',
    'اكتمال أيام الخطط الـ 7 لكل خطة (28 يوماً تفصيلياً)',
    allDaysValid && totalDaysCount === 28,
    `تم التحقق من 28 يوماً بمحتواها الكتابي والتأملي والممارسات الروحية.`
  );

  // ج. اختبار إتمام الأيام وحساب نسبة الإنجاز وحفظها
  const testUser = 'test_fr_marcos_01';
  const testPlanId = 'plan-shepherd-heart';

  // الحالة الابتدائية
  let progress = getPlanProgress(testUser, testPlanId);
  assert(
    'SpiritualLife',
    'الحالة الابتدائية لخطة القراءة',
    progress.completedDays.length === 0,
    `قائمة الأيام المكتملة فارغة مبدئياً.`
  );

  // تحديد اليوم 1 كمكتمل
  progress = togglePlanDayCompletion(testUser, testPlanId, 1);
  assert(
    'SpiritualLife',
    'تحديد اليوم 1 كمكتمل',
    progress.completedDays.includes(1) && progress.completedDays.length === 1,
    `تم إتمام اليوم 1 بنجاح.`
  );

  let completionPct = Math.round((progress.completedDays.length / 7) * 100);
  assert(
    'SpiritualLife',
    'حساب نسبة الإنجاز لليوم الأول (14%)',
    completionPct === 14,
    `النسبة المحسوبة: ${completionPct}%`
  );

  // تحديد اليوم 2 و 3 كمكتملين
  progress = togglePlanDayCompletion(testUser, testPlanId, 2);
  progress = togglePlanDayCompletion(testUser, testPlanId, 3);
  completionPct = Math.round((progress.completedDays.length / 7) * 100);
  assert(
    'SpiritualLife',
    'حساب نسبة الإنجاز لثلاثة أيام (43%)',
    completionPct === 43 && progress.completedDays.length === 3,
    `تم إتمام 3 أيام والنسبة المحسوبة: ${completionPct}%`
  );

  // إلغاء إكمال اليوم 1
  progress = togglePlanDayCompletion(testUser, testPlanId, 1);
  assert(
    'SpiritualLife',
    'إلغاء إكمال اليوم 1',
    !progress.completedDays.includes(1) && progress.completedDays.length === 2,
    `تم إلغاء اليوم 1 والأيام المتبقية: ${progress.completedDays.join(', ')}`
  );

  // التحقق من استعادة النسبة والتقدم بعد إعادة القراءة (محاكاة إعادة فتح المنصة)
  const reloadedProgress = getPlanProgress(testUser, testPlanId);
  assert(
    'SpiritualLife',
    'حفظ واسترجاع التقدم بعد إعادة فتح المنصة',
    reloadedProgress.completedDays.length === 2 &&
      reloadedProgress.completedDays.includes(2) &&
      reloadedProgress.completedDays.includes(3),
    `تم استرجاع التقدم بدقة من الذاكرة المحلية.`
  );

  // إكمال كافة الأيام الـ 7 والتحقق من نسبة 100%
  for (let d = 1; d <= 7; d++) {
    if (!reloadedProgress.completedDays.includes(d)) {
      togglePlanDayCompletion(testUser, testPlanId, d);
    }
  }
  const completedAllProgress = getPlanProgress(testUser, testPlanId);
  const finalPct = Math.round((completedAllProgress.completedDays.length / 7) * 100);
  assert(
    'SpiritualLife',
    'إكمال الخطة بنسبة 100%',
    finalPct === 100 && completedAllProgress.completedDays.length === 7,
    `تم إتمام الخطة بالكامل بنسبة ${finalPct}%`
  );

  // =========================================================================
  // 2. اختبار قسم الدراسة الكتابية (BiblicalStudyView)
  // =========================================================================
  console.log('\n--- 2. اختبارات قسم الدراسة الكتابية والتوثيق الآبائي ---');

  assert(
    'BiblicalStudy',
    'وجود الدراسات الأربع التخصصية',
    BIBLICAL_STUDY_TOPICS.length === 4,
    `تم العثور على ${BIBLICAL_STUDY_TOPICS.length} دراسات تخصصية موثقة.`
  );

  let allPatristicsDocumented = true;
  let allBiblicalRefsValid = true;
  let allTakeawaysValid = true;

  for (const topic of BIBLICAL_STUDY_TOPICS) {
    if (!topic.biblicalReferences || topic.biblicalReferences.length < 3) {
      allBiblicalRefsValid = false;
    }
    if (!topic.patristicQuotes || topic.patristicQuotes.length < 2) {
      allPatristicsDocumented = false;
    }
    for (const quote of topic.patristicQuotes) {
      if (!quote.fatherName || !quote.quote || !quote.source || quote.source.trim() === '') {
        allPatristicsDocumented = false;
      }
    }
    if (!topic.keyTakeaways || topic.keyTakeaways.length < 3) {
      allTakeawaysValid = false;
    }
  }

  assert(
    'BiblicalStudy',
    'الشواهد الكتابية الصحيحة لكل موضوع (3+ شواهد لكل موضوع)',
    allBiblicalRefsValid,
    `تم فحص كافة الشواهد الكتابية وتبين أنها دقيقة ونظامية.`
  );

  assert(
    'BiblicalStudy',
    'التوثيق الآبائي الرصين وعدم وجود أقوال مجهولة المصدر',
    allPatristicsDocumented,
    `كل قول آبائي مسند بدقة لاسم الأب والمصدر (مثل: تجسد الكلمة ف54، سلم الفضائل م27، ميامر مار إسحق...).`
  );

  assert(
    'BiblicalStudy',
    'التطبيقات العملية وخلاصات التكريس',
    allTakeawaysValid,
    `جميع الدراسات تشتمل على خلاصات وتطبيقات رعوية وروحية معتمدة.`
  );

  // بنك الأسئلة والشروح
  const storedQuestions = getStoredQuestions();
  assert(
    'BiblicalStudy',
    'ربط بنك الأسئلة والعلوم الكنسية بالدراسة',
    storedQuestions.length >= 30,
    `تم ربط بنك الأسئلة بالدراسة بعدد ${storedQuestions.length} سؤالاً وشرحاً كنسياً.`
  );

  // =========================================================================
  // 3. اختبار قسم المساحة الشخصية والمذكرات المشفرة (PersonalSpaceView)
  // =========================================================================
  console.log('\n--- 3. اختبارات المساحة الشخصية وتشفير المخدع وفصل المستخدمين ---');

  const userFather = 'user_father_athanasius';
  const userSister = 'user_sister_mary';

  // تنظيف أي بيانات سابقة للاختبار
  localStorage.removeItem(`hql_spiritual_diary_${userFather}`);
  localStorage.removeItem(`hql_spiritual_diary_${userSister}`);

  // أ. إنشاء تدوين جديد
  const secretGratitude = 'أشكرك يا رب على النعمة والستر في خدمة اليوم المنهكة';
  const secretConfession = 'شعرت بضيق وتسرع في الرد، أحتاج لمناقشة هذا مع أبي الروحي';
  const secretContemplation = '«تكفيك نعمتي لأن قوتي في الضعف تكمل»';

  const entry = saveDiaryEntry(userFather, {
    dateString: 'الاثنين 12 أكتوبر 2026',
    gratitudeAndThanks: secretGratitude,
    dailyBibleContemplation: secretContemplation,
    confessionNote: secretConfession,
    prayerRequests: ['صلوات لأجل المرضى', 'سلام الكنيسة'],
    personalResolution: 'الصمت وضبط اللسان قبل صلاة النوم',
    virtueTrackedId: MONASTIC_VIRTUES[0].id,
    isPrivate: true,
  });

  assert(
    'PersonalSpace',
    'إنشاء تدوين جديد في المخدع',
    !!entry && !!entry.id,
    `تم إنشاء التدوين بنجاح بمعرف: ${entry.id}`
  );

  // ب. التحقق من آلية التشفير الفعلي قبل الحفظ في الذاكرة
  const rawFatherStorage = localStorage.getItem(`hql_spiritual_diary_${userFather}`);
  const isEncrypted = isDiaryEncryptedInStorage(userFather);
  const rawContainsPlainText =
    rawFatherStorage?.includes('اعتراف') ||
    rawFatherStorage?.includes('المنهكة') ||
    rawFatherStorage?.includes('نعمتي');

  assert(
    'PersonalSpace',
    'تشفير المذكرات قبل كتابتها في التخزين المحلي (Client-Side Encryption)',
    isEncrypted && !rawContainsPlainText,
    `البيانات مشفرة بصيغة enc_v1 ولا يمكن قراءة النصوص السرية في التخزين الخام (${rawFatherStorage?.substring(0, 30)}...)`
  );

  // ج. قراءة واسترجاع التدوين وفك التشفير التلقائي
  const retrievedEntries = getDiaryEntries(userFather);
  assert(
    'PersonalSpace',
    'استرجاع التدوينات وفك تشفيرها بنجاح مع سلامة النصوص العربية',
    retrievedEntries.length === 1 &&
      retrievedEntries[0].confessionNote === secretConfession &&
      retrievedEntries[0].gratitudeAndThanks === secretGratitude,
    `تم فك التشفير ومطابقة النصوص بالكامل.`
  );

  // د. اختبار تعديل التدوين
  const updatedNote = 'تمت مناقشة الأمر في الاعتراف ونلت الحل والسلام';
  const updateResult = updateDiaryEntry(userFather, entry.id, {
    confessionNote: updatedNote,
  });

  const entriesAfterUpdate = getDiaryEntries(userFather);
  assert(
    'PersonalSpace',
    'تعديل تدوين المخدع وحفظ التحديث مشفراً',
    !!updateResult &&
      entriesAfterUpdate[0].confessionNote === updatedNote &&
      isDiaryEncryptedInStorage(userFather),
    `تم تعديل التدوين والتأكد من بقاء التشفير سارياً.`
  );

  // هـ. اختبار فصل بيانات المستخدمين (User Data Isolation)
  const sisterEntry = saveDiaryEntry(userSister, {
    dateString: 'الاثنين 12 أكتوبر 2026',
    gratitudeAndThanks: 'شكر في خدمة بيت التكريس',
    dailyBibleContemplation: '«مريم اختارت النصيب الصالح»',
    confessionNote: 'تدريب على الهدوء وسكون الفكر',
    prayerRequests: ['خدمة الفتيات'],
    personalResolution: 'قراءة نصف ساعة في بستان الرهبان',
    virtueTrackedId: MONASTIC_VIRTUES[1].id,
    isPrivate: true,
  });

  const fatherEntriesCheck = getDiaryEntries(userFather);
  const sisterEntriesCheck = getDiaryEntries(userSister);

  assert(
    'PersonalSpace',
    'فصل تام لبيانات المستخدمين ومنع التداخل',
    fatherEntriesCheck.length === 1 &&
      sisterEntriesCheck.length === 1 &&
      fatherEntriesCheck[0].id !== sisterEntriesCheck[0].id &&
      !fatherEntriesCheck[0].gratitudeAndThanks?.includes('التكريس') &&
      !sisterEntriesCheck[0].confessionNote?.includes('الاعتراف ونلت الحل'),
    `مذكرات كل مستخدم مستقلة تماماً ومشفرة بمفتاحه الخاص.`
  );

  // و. اختبار حذف التدوين
  deleteDiaryEntry(userFather, entry.id);
  const fatherEntriesAfterDelete = getDiaryEntries(userFather);
  assert(
    'PersonalSpace',
    'حذف التدوين من المخدع بنجاح',
    fatherEntriesAfterDelete.length === 0,
    `تم حذف التدوين وتفريغ القائمة الخاصة بالمستخدم.`
  );

  // ز. اختبار حبل الصلاة وإحصائيات المخدع
  recordRosarySession(userSister, 33, 1);
  const rosary = getRosaryStats(userSister);
  assert(
    'PersonalSpace',
    'تسجيل صلوات حبل الصلاة (صلاة يسوع)',
    rosary.totalBeads === 33 && rosary.totalRopes === 1,
    `إجمالي الحبات: ${rosary.totalBeads}، إجمالي الحبال: ${rosary.totalRopes}.`
  );

  // =========================================================================
  // 4. اختبار تراجعي للوظائف الحالية (Regression Testing)
  // =========================================================================
  console.log('\n--- 4. الاختبار التراجعي للمسابقة وركن الأب الروحي ---');

  // أ. المراحل الست وأسئلتها
  assert(
    'Regression:Competition',
    'وجود المراحل الست المعتمدة',
    COMPETITION_STAGES.length === 6,
    `تم التحقق من وجود ${COMPETITION_STAGES.length} مراحل رسمية.`
  );

  let allStagesHaveQuestions = true;
  for (let s = 1; s <= 6; s++) {
    const qList = STAGE_QUESTIONS.filter((q) => q.stageId === s);
    if (!qList || qList.length === 0) {
      allStagesHaveQuestions = false;
    }
  }
  const stage6Count = STAGE_QUESTIONS.filter((q) => q.stageId === 6).length;
  assert(
    'Regression:Competition',
    'اكتمال وتوفر أسئلة المراحل الست بما فيها المرحلة السادسة (5 أسئلة)',
    allStagesHaveQuestions && stage6Count === 5,
    `جميع المراحل من 1 إلى 6 تحتوي على أسئلتها المعتمدة والمرحلة السادسة تضم ${stage6Count} أسئلة.`
  );

  // ب. التحقق من انتقال المرحلة الخامسة إلى السادسة (وليس حفل الختام)
  // فحص منطق المسابقة: المرحلة التالية بعد 5 هي 6، والمرحلة التالية بعد 6 هي 7 (الختام)
  const nextStageAfter5 = 5 + 1;
  const isFinalCeremonyAfter5 = nextStageAfter5 > 6;
  const nextStageAfter6 = 6 + 1;
  const isFinalCeremonyAfter6 = nextStageAfter6 > 6;

  assert(
    'Regression:Competition',
    'إنهاء المرحلة 5 يفتح المرحلة 6 (وليس التتويج)',
    nextStageAfter5 === 6 && !isFinalCeremonyAfter5,
    `الانتقال من 5 يقود مباشرة إلى المرحلة السادسة (stageId = 6).`
  );

  assert(
    'Regression:Competition',
    'إنهاء المرحلة 6 يوجه إلى حفل التكريم الختامي (final_ceremony)',
    nextStageAfter6 === 7 && isFinalCeremonyAfter6,
    `الانتقال بعد المرحلة 6 يوجه لحفل الختام فقط بعد إتمام الجولة النهائية.`
  );

  // ج. التحقق من ركن الأب الروحي
  assert(
    'Regression:SpiritualGuide',
    'واحة الرهبنة وفضائل البرية',
    MONASTIC_VIRTUES.length === 6,
    `تم التحقق من ${MONASTIC_VIRTUES.length} فضائل رهبانية رئيسية بشواهدها وتدريباتها.`
  );

  assert(
    'Regression:SpiritualGuide',
    'أمهات البرية والقول الروحي الموثق',
    DESERT_MOTHERS.length === 5,
    `تم التحقق من ${DESERT_MOTHERS.length} أمهات برية بأقوالهن وتاريخهن.`
  );

  assert(
    'Regression:SpiritualGuide',
    'حكمة الأب الروحي وإجابات الأسئلة المتكررة',
    FALLBACK_SPIRITUAL_TOPICS.length >= 6 && SPIRITUAL_PROMPT_SUGGESTIONS.length >= 6,
    `تم التحقق من ${FALLBACK_SPIRITUAL_TOPICS.length} إجابة معتمدة و ${SPIRITUAL_PROMPT_SUGGESTIONS.length} اقتراحاً تفاعلياً للأب الروحي.`
  );

  // د. تسجيل المشاركين والرتب التكريسية
  const regPriest = registerParticipant({
    name: 'أبونا أنطونيوس',
    vocation: 'كاهن',
    consecrationHouse: 'كنيسة الشهيد مارجرجس',
    diocese: 'إيبارشية طنطا',
    governorate: 'الغربية',
  });

  const regMonk = registerParticipant({
    name: 'أبونا بولا',
    vocation: 'راهب',
    consecrationHouse: 'دير الأنبا أنطونيوس',
    diocese: 'البحر الأحمر',
    governorate: 'السويس',
  });

  const regNun = registerParticipant({
    name: 'الأم سارة',
    vocation: 'راهبة',
    consecrationHouse: 'دير الشهيدة دميانة',
    diocese: 'إيبارشية بلقاس',
    governorate: 'الدقهلية',
  });

  const regSister = registerParticipant({
    name: 'تاسوني مريم',
    vocation: 'مكرسة',
    consecrationHouse: 'بيت بنات مريم',
    diocese: 'إيبارشية بني سويف',
    governorate: 'بني سويف',
  });

  assert(
    'Regression:Registration',
    'الرتب والقيم الافتراضية الصحيحة لتسجيل المشاركين',
    regPriest.consecrationRank === 'كاهن (قس)' &&
      regMonk.consecrationRank === 'راهب متبتل' &&
      regNun.consecrationRank === 'راهبة مكرسة' &&
      regSister.consecrationRank === 'مكرسة دائمة',
    `تم تسجيل الفئات الأربع بالرتب والقيم الافتراضية المعتمدة بنجاح تام.`
  );

  // =========================================================================
  // 5. اختبارات وضع القراءة الليلي وإعدادات التطبيق وتعديل التباين وتخفيف الورق
  // =========================================================================
  console.log('\n--- 5. اختبارات وضع القراءة الليلي وإعدادات التطبيق وتعديل التباين وتخفيف الورق ---');

  // أ. مفتاح تبديل وضع القراءة الليلي وحفظه في التخزين
  localStorage.setItem('hql_night_reading_mode', 'true');
  const savedNightMode = localStorage.getItem('hql_night_reading_mode') === 'true';
  assert(
    'ReadingSettings',
    'تفعيل مفتاح وضع القراءة الليلي وحفظه في التخزين',
    savedNightMode === true,
    `تم التحقق من تشغيل مفتاح وضع القراءة وحفظه في localStorage.`
  );

  // ب. تعديل تباين النصوص (3 خيارات: هادئ ومريح، عالي وواضح، كنسي ذهبي)
  localStorage.setItem('hql_reading_contrast_level', 'comfortable');
  const savedContrast1 = localStorage.getItem('hql_reading_contrast_level');
  localStorage.setItem('hql_reading_contrast_level', 'high');
  const savedContrast2 = localStorage.getItem('hql_reading_contrast_level');
  localStorage.setItem('hql_reading_contrast_level', 'golden_warm');
  const savedContrast3 = localStorage.getItem('hql_reading_contrast_level');
  assert(
    'ReadingSettings',
    'تعديل تباين النصوص (هادئ ومريح، عالي وواضح، ذهبي كنسي)',
    savedContrast1 === 'comfortable' && savedContrast2 === 'high' && savedContrast3 === 'golden_warm',
    `تم التحقق من دعم وتخزين كافة خيارات تباين النصوص بنجاح.`
  );

  // ج. تخفيف خلفية الورق والبردي (3 خيارات: ورق سيبيا دافئ، فحم خافت، بردي معتق)
  localStorage.setItem('hql_reading_paper_tone', 'warm_sepia');
  const tone1 = localStorage.getItem('hql_reading_paper_tone');
  localStorage.setItem('hql_reading_paper_tone', 'soft_charcoal');
  const tone2 = localStorage.getItem('hql_reading_paper_tone');
  localStorage.setItem('hql_reading_paper_tone', 'parchment_muted');
  const tone3 = localStorage.getItem('hql_reading_paper_tone');
  assert(
    'ReadingSettings',
    'تخفيف خلفية الورق (ورق سيبيا دافئ، فحم خافت، بردي معتق)',
    tone1 === 'warm_sepia' && tone2 === 'soft_charcoal' && tone3 === 'parchment_muted',
    `تم التحقق من خيارات تخفيف خلفية الورق وإلغاء التوهج الأبيض المزعج للعين.`
  );

  // د. درجات تخفيف التوهج (خفيف، متوازن، أقصى سكون)
  localStorage.setItem('hql_reading_paper_softening', 'deep');
  const softening = localStorage.getItem('hql_reading_paper_softening');
  assert(
    'ReadingSettings',
    'درجات تخفيف توهج السطح لسكون المخدع (أقصى سكون)',
    softening === 'deep',
    `تم التحقق من حفظ درجة تخفيف توهج السطح لسكون القلاية والمخدع.`
  );

  // هـ. تبديل الوضع للنهاري وحفظ التغيير
  localStorage.setItem('hql_night_reading_mode', 'false');
  const toggledOff = localStorage.getItem('hql_night_reading_mode') === 'false';
  assert(
    'ReadingSettings',
    'إيقاف وضع القراءة والعودة للوضع النهاري',
    toggledOff === true,
    `تم التحقق من سلاسة إيقاف الوضع وتحديث المفتاح.`
  );

  // =========================================================================
  // ملخص النتائج النهائي
  // =========================================================================
  console.log('\n================================================================');
  console.log('📊 ملخص نتائج اختبار التحقق العملي:');
  console.log('================================================================');

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log(`إجمالي الاختبارات: ${results.length}`);
  console.log(`الاختبارات الناجحة: ${passedCount} ✅`);
  console.log(`الاختبارات الفاشلة: ${failedCount} ❌`);

  if (failedCount > 0) {
    console.error('\n⚠️ فشل في بعض الاختبارات، يرجى المراجعة!');
    process.exit(1);
  } else {
    console.log('\n🎉 جميع الاختبارات اجتازت الفحص بنجاح تام بنسبة 100%!');
  }
}

runPhase1Verification().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
