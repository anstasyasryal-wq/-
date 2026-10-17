import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  Sparkles,
  ChevronLeft,
  Lightbulb,
  FileText,
  Plus,
  Trash2,
  Copy,
  Check,
  Edit3,
  X,
  Share2,
} from 'lucide-react';

export interface CreativeDraft {
  id: string;
  title: string;
  type: 'عظة كتابية' | 'تأمل روحي' | 'ترنيمة روحية' | 'مشروع خدمة';
  date: string;
  content: string;
}

interface CreativeLabProps {
  currentUser?: User | null;
  onBackToHome: () => void;
}

const STORAGE_KEY = 'mokarasa_creative_drafts_v1';

const INITIAL_DRAFTS: CreativeDraft[] = [
  {
    id: 'draft-1',
    title: 'البصمة الإلهية في الشفرة الوراثية والخليقة',
    type: 'عظة كتابية',
    date: '10 أكتوبر 2026',
    content:
      'مقدمة حول دقة تسلسل الـ DNA وكيف يعكس عظمة يد الصانع الأزلي، وتفنيد نظريات الصدفة العشوائية ببراهين بيولوجية معلنة في ضوء المزامير.',
  },
  {
    id: 'draft-2',
    title: 'صمت المخدع في برية مصر وأنفاس الهدوء',
    type: 'تأمل روحي',
    date: '12 أكتوبر 2026',
    content:
      'في سكون المغارة لا تسمع إلا همس النعمة، فلتصمت كل أصوات العالم ومشاغله ليتكلم الروح في أعماق القلب.',
  },
];

export const CreativeLab: React.FC<CreativeLabProps> = ({ currentUser, onBackToHome }) => {
  const [drafts, setDrafts] = useState<CreativeDraft[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DRAFTS;
    } catch {
      return INITIAL_DRAFTS;
    }
  });

  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftType, setDraftType] = useState<CreativeDraft['type']>('عظة كتابية');
  const [draftContent, setDraftContent] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const saveDraftsToStorage = (updated: CreativeDraft[]) => {
    setDrafts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleOpenNewDraft = () => {
    soundManager.playTick();
    setEditingDraftId(null);
    setDraftTitle('');
    setDraftType('عظة كتابية');
    setDraftContent('');
    setIsEditorOpen(true);
  };

  const handleEditDraft = (d: CreativeDraft) => {
    soundManager.playTick();
    setEditingDraftId(d.id);
    setDraftTitle(d.title);
    setDraftType(d.type);
    setDraftContent(d.content);
    setIsEditorOpen(true);
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    soundManager.playCorrect();
    const nowStr = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (editingDraftId) {
      const updated = drafts.map((d) =>
        d.id === editingDraftId
          ? { ...d, title: draftTitle.trim(), type: draftType, content: draftContent.trim(), date: nowStr }
          : d
      );
      saveDraftsToStorage(updated);
    } else {
      const newD: CreativeDraft = {
        id: `draft-${Date.now()}`,
        title: draftTitle.trim(),
        type: draftType,
        date: nowStr,
        content: draftContent.trim() || 'مسودة قيد الكتابة والتوثيق.',
      };
      saveDraftsToStorage([newD, ...drafts]);
    }
    setIsEditorOpen(false);
  };

  const handleDeleteDraft = (id: string) => {
    soundManager.playTick();
    const updated = drafts.filter((d) => d.id !== id);
    saveDraftsToStorage(updated);
  };

  const handleCopyDraft = (d: CreativeDraft) => {
    soundManager.playTick();
    const textToCopy = `«${d.title}» (${d.type})\n${d.content}\n— منصة حسب قلب الله`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedId(d.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-pink-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 border border-pink-600/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-900/60 border border-pink-600/40 text-pink-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>مساحة الإنتاج الروحي والتفكير الإبداعي</span>
          </div>
          <button
            onClick={handleOpenNewDraft}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء مسودة جديدة</span>
          </button>
        </div>

        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          ✨ مختبر الإبداع الروحي والفكري
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          مساحة لإعداد وحفظ مسودات العظات، الألحان، الخواطر، ومشاريع الخدمة التكريسية وحفظها محلياً بأمان تام.
        </p>
      </div>

      {/* Drafts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drafts.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-pink-500/50 transition space-y-3 flex flex-col justify-between shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-amber-400">
                <span className="font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/40">
                  {d.type}
                </span>
                <span className="text-stone-400 font-mono text-[10px]">{d.date}</span>
              </div>
              <h4 className="font-spiritual text-base sm:text-lg font-bold text-stone-100">
                {d.title}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800/60">
                {d.content}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyDraft(d)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="نسخ المسودة"
                >
                  {copiedId === d.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleEditDraft(d)}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>تعديل</span>
                </button>
              </div>

              <button
                onClick={() => handleDeleteDraft(d.id)}
                className="text-stone-500 hover:text-rose-400 text-xs transition cursor-pointer p-1"
                title="حذف المسودة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DRAFT EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl bg-stone-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-spiritual text-lg font-bold text-amber-100">
                {editingDraftId ? 'تعديل المسودة' : 'إنشاء مسودة إبداعية جديدة'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDraft} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-stone-300 font-bold">عنوان المسودة:</label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="مثال: عظة عن محبة الأعداء في الإنجيل..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-300 font-bold">نوع العمل الإبداعي:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['عظة كتابية', 'تأمل روحي', 'ترنيمة روحية', 'مشروع خدمة'] as const).map(
                    (t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setDraftType(t)}
                        className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          draftType === t
                            ? 'bg-amber-600 text-white border-amber-400'
                            : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-amber-600/40'
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-300 font-bold">نص ومسودة الفكرة:</label>
                <textarea
                  rows={5}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="اكتب أفكارك وشواهدك وعناصر الموضوع هنا..."
                  className="w-full p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  حفظ المسودة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
