import { LIBRARY_ARTICLES } from '../src/data/libraryArticles';
import { LIBRARY_BOOKS } from '../src/data/libraryBooks';
import { SCHOLARLY_REFERENCES } from '../src/data/scholarlyReferences';
import { INTERACTIVE_WORKSHOPS } from '../src/data/workshopsData';
import { libraryStorage } from '../src/utils/libraryStorage';
import { workshopsStorage } from '../src/utils/workshopsStorage';
import { creativeStorage } from '../src/utils/creativeStorage';
import { getStoredStages, getStoredQuestions } from '../src/utils/competitionEngine';

// Mock localStorage for Node testing environment
const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => {
    mockStorage[key] = String(val);
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
  key: (i: number) => Object.keys(mockStorage)[i] || null,
  length: 0,
};

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${testName} ${details ? `(${details})` : ''}`);
    failCount++;
  }
}

console.log('================================================================');
console.log('🧪 بدء اختبار التحقق والتكامل للتوسعة الشاملة - منصة حسب قلب الله');
console.log('================================================================');

// 1. LIBRARY TESTS
console.log('\n--- 1. اختبارات المكتبة المعرفية (مقالات، كتب، مراجع) ---');
assert(LIBRARY_ARTICLES.length >= 5, 'اكتمال مقالات المكتبة الموثقة', `Count: ${LIBRARY_ARTICLES.length}`);
const allArticlesHaveSections = LIBRARY_ARTICLES.every(
  (a) => a.sections && a.sections.length > 0 && a.summary && a.author && a.readingTimeMinutes > 0
);
assert(allArticlesHaveSections, 'سلامة بنية المقالات وتوثيقها وأقسامها وشواهدها');

assert(LIBRARY_BOOKS.length >= 6, 'اكتمال كتب التراث والكتاب المقدس والخدمة', `Count: ${LIBRARY_BOOKS.length}`);
const allBooksValid = LIBRARY_BOOKS.every(
  (b) => b.totalPages > 0 && b.tableOfContents && b.tableOfContents.length > 0 && b.legalStatus
);
assert(allBooksValid, 'سلامة بطاقات الكتب وفهارسها وحالتها القانونية');

assert(SCHOLARLY_REFERENCES.length >= 5, 'اكتمال المراجع الأكاديمية والمخطوطات والقواميس');

// Library Storage Test
const testUserId = 'test_user_777';
libraryStorage.saveArticleProgress(testUserId, LIBRARY_ARTICLES[0].id, 80, LIBRARY_ARTICLES[0].title);
const progressVal = libraryStorage.getArticleProgress(testUserId, LIBRARY_ARTICLES[0].id);
assert(progressVal === 80, 'حفظ واسترجاع تقدم قراءة المقال بدقة');

const isFav = libraryStorage.toggleFavoriteArticle(testUserId, LIBRARY_ARTICLES[0].id);
assert(isFav === true, 'إضافة المقال للمفضلة بنجاح');
const favs = libraryStorage.getFavoriteArticles(testUserId);
assert(favs.includes(LIBRARY_ARTICLES[0].id), 'استرجاع قائمة المقالات المفضلة');

libraryStorage.saveBookRecord(testUserId, {
  bookId: LIBRARY_BOOKS[0].id,
  status: 'reading',
  currentPage: 45,
  totalPages: LIBRARY_BOOKS[0].totalPages,
  lastUpdated: new Date().toISOString(),
  personalNotes: 'تأمل رائع في سر الفداء وتجديد الطبيعة البشرية',
  isFavorite: true,
});
const savedBook = libraryStorage.getBookRecord(testUserId, LIBRARY_BOOKS[0].id);
assert(savedBook.currentPage === 45 && savedBook.status === 'reading', 'حفظ ومتابعة صفحة قراءة الكتاب والملاحظات');

// 2. INTERACTIVE WORKSHOPS TESTS
console.log('\n--- 2. اختبارات ورش العمل التفاعلية (10 ورش عمل) ---');
assert(INTERACTIVE_WORKSHOPS.length === 10, 'وجود الـ 10 ورش عمل المطلوبة بالكامل', `Count: ${INTERACTIVE_WORKSHOPS.length}`);

const allWorkshopsComplete = INTERACTIVE_WORKSHOPS.every((ws) => {
  return (
    ws.units.length > 0 &&
    ws.objectives.length > 0 &&
    ws.finalProject &&
    ws.finalProject.deliverables.length > 0
  );
});
assert(allWorkshopsComplete, 'اكتمال الوحدات والأهداف والمشروعات الختامية لكل ورشة');

// Workshop progress test
const testWs = INTERACTIVE_WORKSHOPS[0];
const testUnit = testWs.units[0];
workshopsStorage.markUnitCompleted(testUserId, testWs.id, testUnit.id, 1, { [testUnit.reviewQuiz[0]?.id || 'q1']: 0 }, 'ملاحظات تطبيقية');
const wsProg = workshopsStorage.getWorkshopProgress(testUserId, testWs.id);
assert(wsProg.completedUnitIds.includes(testUnit.id), 'تسجيل إتمام الوحدة واجتياز أسئلتها');

workshopsStorage.submitFinalProject(testUserId, testWs.id, 'مسودة المشروع الختامي الكامل لدراسة مزمور 23');
const finalProg = workshopsStorage.getWorkshopProgress(testUserId, testWs.id);
assert(finalProg.isCompleted === true && Boolean(finalProg.finalProjectDraft), 'تسجيل تسليم المشروع الختامي واعتماد إتمام الورشة');

// 3. CREATIVE LAB & MINISTRY DRAFTS TESTS
console.log('\n--- 3. اختبارات مختبر الإبداع ومسودات الخدمة ---');
const newDraft = creativeStorage.createEmptyDraft(testUserId, 'sermon_preparation', 'مخطط عظة: الراعي الصالح');
newDraft.content = {
  theme: 'يوحنا 10: 1-18',
  centralObjective: 'معرفة صوت الراعي والاتكال عليه في الشدائد',
  bodyText: 'المقدمة: ... النقطة الأولى: محبة الراعي الباذلة...',
};
creativeStorage.saveUserDraft(testUserId, newDraft);
const userDrafts = creativeStorage.getUserDrafts(testUserId);
assert(userDrafts.length === 1 && userDrafts[0].title === 'مخطط عظة: الراعي الصالح', 'إنشاء وحفظ مسودة عظة في مساحة المستخدم');

// Isolation test: check that other user doesn't see testUserId drafts
const otherUserDrafts = creativeStorage.getUserDrafts('other_user_888');
assert(otherUserDrafts.length === 0, 'عزل مسودات المستخدمين وحماية الخصوصية التامة');

const exportedText = creativeStorage.exportDraftAsText(newDraft);
assert(exportedText.includes('الراعي الصالح') && exportedText.includes('يوحنا 10'), 'تصدير مسودة الخدمة بصيغة نصية كاملة');

// 4. REGRESSION CHECK ON CORE PROTECTED COMPETITION
console.log('\n--- 4. التحقق من سلامة الأجزاء المحمية (المسابقة الرسمية والأسئلة) ---');
const stages = getStoredStages();
assert(stages.length === 6, 'ثبات المراحل الست الرسمية للمسابقة');

const { INITIAL_QUESTIONS } = await import('../src/data/questions');
assert(INITIAL_QUESTIONS.length === 95, 'ثبات بنك الأسئلة الرئيسي كاملاً (95 سؤالاً موثقاً)');

const stageQuestions = getStoredQuestions();
assert(stageQuestions.length === 61, 'ثبات أسئلة المراحل الرسمية (61 سؤالاً للمراحل 1-6)');

console.log('================================================================');
console.log(`ملخص النتائج: نجح ${passCount} من ${passCount + failCount} اختبارات.`);
if (failCount > 0) {
  console.error(`هناك ${failCount} اختبارات فاشلة!`);
  process.exit(1);
} else {
  console.log('🎉 جميع اختبارات التوسعة الشاملة اجتازت الفحص بنجاح تام بنسبة 100%!');
}
