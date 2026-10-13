import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../types';
import { Article, BookItem, ScholarlyReference, BookReadingStatus } from '../types/library';
import { LIBRARY_ARTICLES } from '../data/libraryArticles';
import { LIBRARY_BOOKS } from '../data/libraryBooks';
import { SCHOLARLY_REFERENCES } from '../data/scholarlyReferences';
import { libraryStorage, RecentItem } from '../utils/libraryStorage';
import { useReadingTheme } from '../context/ReadingThemeContext';
import { soundManager } from '../utils/audio';
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Clock,
  User as UserIcon,
  ChevronLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  BookMarked,
  Quote,
  Sparkles,
  FileText,
  Layers,
  GraduationCap,
  Calendar,
  Share2,
  Printer,
  Sliders,
  Check,
} from 'lucide-react';

interface LibraryViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'books' | 'references'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vocationFilter, setVocationFilter] = useState<string>('all');

  // Reader modal states
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  // User state
  const userId = currentUser?.id || 'guest_user';
  const [favoriteArticleIds, setFavoriteArticleIds] = useState<string[]>([]);
  const [bookRecords, setBookRecords] = useState<Record<string, any>>({});
  const [bookNotesInput, setBookNotesInput] = useState<string>('');
  const [bookPageInput, setBookPageInput] = useState<number>(0);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const { isNightMode, getCardClass, getContainerClass } = useReadingTheme();

  useEffect(() => {
    setFavoriteArticleIds(libraryStorage.getFavoriteArticles(userId));
    setBookRecords(libraryStorage.getUserBookRecords(userId));
  }, [userId]);

  const handleToggleFavorite = (articleId: string) => {
    soundManager.playTick();
    const nextState = libraryStorage.toggleFavoriteArticle(userId, articleId);
    setFavoriteArticleIds(libraryStorage.getFavoriteArticles(userId));
    setSaveToast(nextState ? 'تمت إضافة المقال إلى المفضلة' : 'تمت إزالة المقال من المفضلة');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleOpenArticle = (art: Article) => {
    soundManager.playTick();
    setReadingArticle(art);
    libraryStorage.saveArticleProgress(userId, art.id, 100, art.title);
  };

  const handleOpenBook = (book: BookItem) => {
    soundManager.playTick();
    setSelectedBook(book);
    const rec = libraryStorage.getBookRecord(userId, book.id);
    setBookNotesInput(rec.personalNotes || '');
    setBookPageInput(rec.currentPage || 0);
  };

  const handleUpdateBookStatus = (bookId: string, status: BookReadingStatus) => {
    if (!selectedBook) return;
    soundManager.playCorrect();
    const currentRec = libraryStorage.getBookRecord(userId, bookId);
    const updated = {
      ...currentRec,
      bookId,
      status,
      currentPage: status === 'completed' ? selectedBook.totalPages : bookPageInput,
      totalPages: selectedBook.totalPages,
      personalNotes: bookNotesInput,
    };
    libraryStorage.saveBookRecord(userId, updated);
    setBookRecords(libraryStorage.getUserBookRecords(userId));
    setSaveToast('تم تحديث حالة القراءة بنجاح');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleSaveBookNotes = () => {
    if (!selectedBook) return;
    soundManager.playTick();
    const currentRec = libraryStorage.getBookRecord(userId, selectedBook.id);
    const updated = {
      ...currentRec,
      bookId: selectedBook.id,
      currentPage: Math.min(selectedBook.totalPages, Math.max(0, bookPageInput)),
      totalPages: selectedBook.totalPages,
      personalNotes: bookNotesInput,
    };
    libraryStorage.saveBookRecord(userId, updated);
    setBookRecords(libraryStorage.getUserBookRecords(userId));
    setSaveToast('تم حفظ الملاحظات والصفحة الحالية في مساحتك الآمنة');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return LIBRARY_ARTICLES.filter((a) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
      const matchVoc =
        vocationFilter === 'all' ||
        a.targetVocations.includes('الكل') ||
        a.targetVocations.includes(vocationFilter as any);

      return matchSearch && matchCat && matchVoc;
    });
  }, [searchQuery, selectedCategory, vocationFilter]);

  // Filtered Books
  const filteredBooks = useMemo(() => {
    return LIBRARY_BOOKS.filter((b) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
      const matchVoc =
        vocationFilter === 'all' ||
        b.targetVocations.includes('الكل') ||
        b.targetVocations.includes(vocationFilter as any);

      return matchSearch && matchCat && matchVoc;
    });
  }, [searchQuery, selectedCategory, vocationFilter]);

  // Filtered References
  const filteredReferences = useMemo(() => {
    return SCHOLARLY_REFERENCES.filter((r) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'all' || r.type === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fade-in text-right">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-emerald-100 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-10 border border-amber-900/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span>المستودع المعرفي والروحي الشامل للمكرسين</span>
          </div>

          <h1 className="font-spiritual text-2xl sm:text-4xl font-bold text-amber-100 leading-tight">
            📚 المكتبة الروحية والمعرفية الموثقة
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
            مستودع كنسي متكامل يجمع بين المقالات الروحية المنهجية، والكتب الكنسية الكلاسيكية والمعاصرة، والمراجع والوثائق الأكاديمية المصنفة بدقة لخدمة الكاهن، والمكرسة، والراهب، والراهبة.
          </p>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3">
            <button
              onClick={() => {
                setActiveTab('articles');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>المقالات الروحية ({LIBRARY_ARTICLES.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('books');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'books'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>الكتب والتراث الكنسي ({LIBRARY_BOOKS.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('references');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'references'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>المراجع والدراسات الأكاديمية ({SCHOLARLY_REFERENCES.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filtering Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان، الكاتب، القديس، الموضوع، أو الشاهد الكتابي..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-slate-900 text-xs sm:text-sm"
            />
          </div>

          <div className="flex gap-2">
            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold focus:border-amber-600 outline-none"
            >
              <option value="all">جميع التصنيفات</option>
              {activeTab === 'articles' && (
                <>
                  <option value="الحياة الروحية والفضيلة">الحياة الروحية والفضيلة</option>
                  <option value="الدراسة وفهم النص">الدراسة وفهم النص</option>
                  <option value="التراث القبطي والتاريخ">التراث القبطي والتاريخ</option>
                  <option value="التكريس والرهبنة">التكريس والرهبنة</option>
                  <option value="القيادة والخدمة">القيادة والخدمة</option>
                  <option value="إعداد العظات والتأملات">إعداد العظات والتأملات</option>
                </>
              )}
              {activeTab === 'books' && (
                <>
                  <option value="الآباء والتراث الكنسي">الآباء والتراث الكنسي</option>
                  <option value="الحياة الروحية والتكريس">الحياة الروحية والتكريس</option>
                  <option value="التاريخ القبطي">التاريخ القبطي</option>
                  <option value="التفاسير والكتاب المقدس">التفاسير والكتاب المقدس</option>
                  <option value="القيادة والرعاية">القيادة والرعاية</option>
                </>
              )}
              {activeTab === 'references' && (
                <>
                  <option value="معجم ومصدر لغوي">معجم ومصدر لغوي</option>
                  <option value="مرجع آبائي">مرجع آبائي</option>
                  <option value="دراسة تاريخية">دراسة تاريخية</option>
                  <option value="دليل إعداد العظات">دليل إعداد العظات</option>
                </>
              )}
            </select>

            {/* Vocation filter (for articles and books) */}
            {activeTab !== 'references' && (
              <select
                value={vocationFilter}
                onChange={(e) => setVocationFilter(e.target.value)}
                className="w-36 px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-semibold focus:border-amber-600 outline-none"
              >
                <option value="all">كل التكريسات</option>
                <option value="كاهن">كاهن</option>
                <option value="مكرسة">مكرسة</option>
                <option value="راهب">راهب</option>
                <option value="راهبة">راهبة</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ARTICLES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-bold">
              المقالات المتاحة: ({filteredArticles.length} مقال موثق)
            </span>
            <span className="text-amber-800 font-semibold">
              مقالات أصلية موثقة بالشواهد الآبائية والتطبيق الرعوي
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => {
              const isFav = favoriteArticleIds.includes(article.id);
              const readProgress = libraryStorage.getArticleProgress(userId, article.id);

              return (
                <div
                  key={article.id}
                  className="rounded-2xl bg-white border border-slate-200 hover:border-amber-400 p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{article.readingTimeMinutes} دقائق</span>
                        </span>
                        <button
                          onClick={() => handleToggleFavorite(article.id)}
                          className="p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                          title={isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                        >
                          {isFav ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-500" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-slate-400 hover:text-amber-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <h3
                      onClick={() => handleOpenArticle(article)}
                      className="font-spiritual font-bold text-base sm:text-lg text-slate-900 cursor-pointer hover:text-amber-800 transition line-clamp-2"
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{article.author}</span>
                    </div>

                    <button
                      onClick={() => handleOpenArticle(article)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>قراءة المقال</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredArticles.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              لم يتم العثور على مقالات تطابق معايير البحث الحالية.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BOOKS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-bold">مكتبة الكتب والتراث: ({filteredBooks.length} كتاب)</span>
            <span className="text-amber-800 font-semibold">
              إمكانية تدوين الملاحظات الخاصة ومتابعة تقدم القراءة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => {
              const rec = bookRecords[book.id] || { status: 'not_started', currentPage: 0 };
              const percent = Math.min(
                100,
                Math.round(((rec.currentPage || 0) / book.totalPages) * 100)
              );

              return (
                <div
                  key={book.id}
                  className="rounded-2xl bg-white border border-slate-200 hover:border-amber-400 p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between space-y-4 text-right"
                >
                  <div className="space-y-3">
                    {/* Visual Book Spine Header */}
                    <div
                      className={`h-24 rounded-xl bg-gradient-to-r ${book.coverColor} p-3.5 text-white flex flex-col justify-between shadow-xs`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="bg-black/30 px-2 py-0.5 rounded-full border border-white/20">
                          {book.category}
                        </span>
                        <span className="bg-amber-400 text-indigo-950 font-bold px-2 py-0.5 rounded-full">
                          {book.readingLevel}
                        </span>
                      </div>
                      <h4 className="font-spiritual font-bold text-sm text-amber-100 line-clamp-1">
                        {book.title}
                      </h4>
                    </div>

                    <div>
                      <h3
                        onClick={() => handleOpenBook(book)}
                        className="font-spiritual font-bold text-base text-slate-900 cursor-pointer hover:text-amber-800 transition line-clamp-2"
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs text-amber-900 font-semibold mt-0.5">{book.author}</p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>حالة القراءة:</span>
                        <span className="font-bold text-indigo-900">
                          {rec.status === 'completed'
                            ? '✅ مكتمل'
                            : rec.status === 'reading'
                            ? `📖 ص ${rec.currentPage || 0} من ${book.totalPages} (${percent}%)`
                            : 'لم تبدأ بعد'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{book.legalStatus}</span>
                    <button
                      onClick={() => handleOpenBook(book)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>تصفح وتدوين</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. REFERENCES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'references' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-bold">
              المراجع الأكاديمية والمصادر المعتمدة: ({filteredReferences.length} مرجع)
            </span>
            <span className="text-amber-800 font-semibold">
              بيانات ببليوغرافية دقيقة وتوثيق علمي للمخطوطات والقواميس
            </span>
          </div>

          <div className="space-y-3">
            {filteredReferences.map((ref) => (
              <div
                key={ref.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      {ref.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {ref.availabilityType}
                    </span>
                  </div>
                  {ref.externalUrl && (
                    <a
                      href={ref.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                    >
                      <span>فتح الرابط الرقمي للمرجع</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div>
                  <h3 className="font-spiritual font-bold text-base text-slate-900">{ref.title}</h3>
                  <p className="text-xs text-slate-600 font-mono mt-0.5 dir-ltr text-right">
                    {ref.bibliographicCitation}
                  </p>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {ref.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ARTICLE READER MODAL */}
      {/* ========================================================================= */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-6 text-right animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFavorite(readingArticle.id)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-xs font-bold flex items-center gap-1.5"
                >
                  {favoriteArticleIds.includes(readingArticle.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-amber-600 fill-amber-500" />
                      <span>في المفضلة</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      <span>حفظ في المفضلة</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setReadingArticle(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Article Meta */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {readingArticle.category} • وقت القراءة: {readingArticle.readingTimeMinutes} دقائق
              </span>
              <h2 className="font-spiritual font-black text-xl sm:text-3xl text-slate-900 leading-snug">
                {readingArticle.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-bold">{readingArticle.subtitle}</p>
              <p className="text-xs text-amber-900">
                بقلم: {readingArticle.author} ({readingArticle.authorRole}) • تاريخ النشر:{' '}
                {readingArticle.publishedDate}
              </p>
            </div>

            {/* Article Sections */}
            <div className="space-y-6 pt-2">
              {readingArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="font-spiritual font-bold text-base sm:text-lg text-indigo-950 border-r-4 border-amber-500 pr-3">
                    {sec.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                    {sec.body}
                  </p>

                  {sec.keyVerse && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs font-spiritual font-bold flex items-center gap-2">
                      <Quote className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{sec.keyVerse}</span>
                    </div>
                  )}

                  {sec.patristicQuote && (
                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 text-xs space-y-1">
                      <span className="font-bold block text-indigo-900">
                        قول الأب: {sec.patristicQuote.father}
                      </span>
                      <p className="font-spiritual text-xs sm:text-sm leading-relaxed">
                        {sec.patristicQuote.quote}
                      </p>
                      <span className="text-[10px] text-indigo-800/80 block text-left">
                        المصدر: {sec.patristicQuote.source}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Scholarly References */}
            {readingArticle.references && readingArticle.references.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 mt-6">
                <span className="font-bold text-slate-800 block">📚 المراجع والمصادر المعتمدة:</span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600 text-[11px]">
                  {readingArticle.references.map((r, i) => (
                    <li key={i}>
                      <strong className="text-slate-800">{r.title}</strong> — {r.author} ({r.source})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setReadingArticle(null)}
                className="px-6 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs cursor-pointer"
              >
                إغلاق ووضع علامة تمّت القراءة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOOK DETAILS & PRIVATE NOTES MODAL */}
      {/* ========================================================================= */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-amber-300 space-y-6 text-right animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                بطاقة الكتاب ومتابعة القراءة الشخصية
              </span>
              <button
                onClick={() => setSelectedBook(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Book Info */}
            <div className="space-y-2">
              <h2 className="font-spiritual font-black text-xl sm:text-2xl text-slate-900">
                {selectedBook.title}
              </h2>
              <p className="text-xs text-amber-900 font-bold">
                المؤلف: {selectedBook.author} {selectedBook.authorEra ? `(${selectedBook.authorEra})` : ''}
              </p>
              <p className="text-xs text-slate-500">
                الناشر: {selectedBook.publisher || 'تراث كنسي'} • سنة النشر: {selectedBook.publishYear || '—'} • عدد الصفحات: {selectedBook.totalPages}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60">
                {selectedBook.description}
              </p>
            </div>

            {/* Reading Status Controls */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3">
              <span className="text-xs font-bold text-indigo-950 block">📌 تحديث حالة قراءتك:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateBookStatus(selectedBook.id, 'not_started')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    (bookRecords[selectedBook.id]?.status || 'not_started') === 'not_started'
                      ? 'bg-indigo-900 text-white'
                      : 'bg-white text-indigo-900 border border-indigo-200'
                  }`}
                >
                  لم أبدأ بعد
                </button>
                <button
                  onClick={() => handleUpdateBookStatus(selectedBook.id, 'reading')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    bookRecords[selectedBook.id]?.status === 'reading'
                      ? 'bg-indigo-900 text-white'
                      : 'bg-white text-indigo-900 border border-indigo-200'
                  }`}
                >
                  أقرأ الآن
                </button>
                <button
                  onClick={() => handleUpdateBookStatus(selectedBook.id, 'completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    bookRecords[selectedBook.id]?.status === 'completed'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  ✅ أنهيت قراءته
                </button>
              </div>

              {/* Current Page Tracker */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-indigo-950 font-semibold">الصفحة التي وصلت إليها:</span>
                <input
                  type="number"
                  min="0"
                  max={selectedBook.totalPages}
                  value={bookPageInput}
                  onChange={(e) => setBookPageInput(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-xl border border-indigo-300 text-xs font-bold bg-white text-indigo-950 text-center"
                />
                <span className="text-xs text-slate-500">من إجمالي {selectedBook.totalPages} صفحة</span>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">📑 فهرس فصول الكتاب:</span>
              <div className="max-h-40 overflow-y-auto pr-1 space-y-1">
                {selectedBook.tableOfContents.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Private Notes Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>🔒 ملاحظاتي وتأملاتي الخاصة حول الكتاب:</span>
                </span>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  خاصة بك تماماً ومحمية
                </span>
              </div>
              <textarea
                value={bookNotesInput}
                onChange={(e) => setBookNotesInput(e.target.value)}
                placeholder="دون هنا اقتباسات أعجبتك، أفكاراً للتأمل، أو تطبيقات تريد مراجعتها في خلوتك..."
                rows={4}
                className="w-full p-3.5 rounded-2xl border border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none text-slate-900 text-xs leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">{selectedBook.legalStatus}</span>
              <button
                onClick={handleSaveBookNotes}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>حفظ الملاحظات والصفحة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
