import React, { useState } from 'react';
import { User, ConsecrationRank, ConsecrationVocation } from '../types';
import { registerParticipant, loginWithCode } from '../utils/competitionEngine';
import { soundManager } from '../utils/audio';
import {
  X,
  Sparkles,
  UserCheck,
  Shield,
  KeyRound,
  Award,
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Cross,
  Church,
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');

  // Vocation Selection
  const [vocation, setVocation] = useState<ConsecrationVocation>('مكرسة');

  // Basic Info
  const [name, setName] = useState('');
  const [consecrationHouse, setConsecrationHouse] = useState('بيت بنات مريم للتكريس');
  const [diocese, setDiocese] = useState('إيبارشية بني سويف');
  const [governorate, setGovernorate] = useState('بني سويف');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');

  // Identity & Ministry Info (فقرة التعريف بالهوية والخدمة)
  const [consecrationRank, setConsecrationRank] = useState<ConsecrationRank>('مكرسة دائمة');
  const [ministryField, setMinistryField] = useState('خدمة المغتربات والجامعيات');
  const [consecrationVerse, setConsecrationVerse] = useState(
    '«وَجَدْتُ دَاوُدَ بْنَ يَسَّى رَجُلاً حَسَبَ قَلْبِي، الَّذِي سَيَصْنَعُ كُلَّ مَشِيئَتِي» (أع 13: 22)'
  );
  const [patronSaint, setPatronSaint] = useState('القديسة مريم العذراء');
  const [personalBio, setPersonalBio] = useState(
    'أكرس حياتي لخدمة المسيح ومراجعة قلبي الداخلي والنمو الروحي في التواضع والأمانة.'
  );

  // Login Form
  const [loginCode, setLoginCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showWelcomeSuccess, setShowWelcomeSuccess] = useState<User | null>(null);

  if (!isOpen) return null;

  const handleVocationChange = (newVocation: ConsecrationVocation) => {
    setVocation(newVocation);
    if (newVocation === 'كاهن') {
      setConsecrationRank('كاهن (قس)');
      setConsecrationHouse('كنيسة السيدة العذراء والأنبا أنطونيوس');
      setMinistryField('الرعاية الكنسية وسر الاعتراف والافتقاد');
      setPatronSaint('القديس يوحنا فم الذهب');
      setConsecrationVerse('«رَعَاهُمْ حَسَبَ كَمَالِ قَلْبِهِ، وَبِمَهَارَةِ يَدَيْهِ هَدَاهُمْ» (مز 78: 72)');
    } else if (newVocation === 'راهب') {
      setConsecrationRank('راهب متبتل');
      setConsecrationHouse('دير القديس العظيم الأنبا أنطونيوس');
      setMinistryField('الصلاة الدائمة والتسابيح والعمل النسكي في الدير');
      setPatronSaint('الأنبا أنطونيوس والأنبا بولا');
      setConsecrationVerse('«كَمَا يَشْتَاقُ الإِيَّلُ إِلَى جَدَاوِلِ الْمِيَاهِ، هكَذَا تَشْتَاقُ نَفْسِي إِلَيْكَ يَا اللهُ» (مز 42: 1)');
    } else if (newVocation === 'راهبة') {
      setConsecrationRank('راهبة مكرسة');
      setConsecrationHouse('دير الشهيد العظيم مارجرجس للراهبات');
      setMinistryField('حياة الصلاة والتأمل والعمل اليدوي الهادئ في الدير');
      setPatronSaint('القديسة دميانة والأربعين عذراء');
      setConsecrationVerse('«أَنَا لِحَبِيبِي وَحَبِيبِي لِي، الرَّاعِي بَيْنَ السَّوْسَنِ» (نش 6: 3)');
    } else {
      setConsecrationRank('مكرسة دائمة');
      setConsecrationHouse('بيت بنات مريم للتكريس');
      setMinistryField('خدمة المغتربات والجامعيات');
      setPatronSaint('القديسة مريم العذراء');
      setConsecrationVerse('«إِنَّمَا الْحَاجَةُ إِلَى وَاحِدٍ؛ فَاخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ» (لو 10: 42)');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('يرجى إدخال الاسم المبارك');
      return;
    }
    setErrorMessage('');

    try {
      soundManager.playVictory();
      const user = registerParticipant({
        name,
        vocation,
        consecrationHouse,
        diocese,
        governorate,
        code: code.trim() || undefined,
        consecrationRank,
        ministryField,
        consecrationVerse,
        personalBio,
        patronSaint,
      });
      setShowWelcomeSuccess(user);
    } catch {
      setErrorMessage('حدث خطأ أثناء التسجيل، يرجى المحاولة ثانية');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginCode.trim()) {
      setErrorMessage('يرجى إدخال كود المشاركة');
      return;
    }
    setErrorMessage('');

    const user = loginWithCode(loginCode);
    if (user) {
      soundManager.playCorrect();
      onSuccess(user);
      onClose();
    } else {
      soundManager.playWrong();
      setErrorMessage(
        'كود المشاركة غير مسجل. يرجى التأكد من كتابة الكود بشكل صحيح أو تسجيل بطاقة التكريس لأول مرة.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-amber-200 overflow-hidden my-auto text-right">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-indigo-800 p-6 text-white text-center relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex p-3 rounded-full bg-white/10 mb-2 border border-white/20">
            <Cross className="w-8 h-8 text-amber-200" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-spiritual tracking-wide">🕊️ حَسَبَ قَلْبِ اللهِ</h2>
          <p className="text-xs text-amber-100 font-bold mt-1">
            «كاهن – مكرَّسة – راهب – راهبة»
          </p>
          <p className="text-[11px] text-amber-200/90 mt-0.5">
            تسجيل بطاقة التكريس والهوية لمسيرة المراجعة والنمو الروحي
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {showWelcomeSuccess ? (
            <div className="p-4 text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-emerald-300">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">تم التسجيل بنعمة وبركة ربنا!</h3>
                <p className="text-sm text-emerald-800 font-semibold bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-200">
                  «أهلاً بكم في مسيرة حسب قلب الله للمراجعة والنمو الروحي»
                </p>

                {/* Identity Summary Card */}
                <div className="bg-gradient-to-b from-amber-50 to-white p-4 rounded-2xl border border-amber-200 text-right text-xs space-y-2 mt-3">
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="font-bold text-slate-800 text-sm">{showWelcomeSuccess.name}</span>
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      {showWelcomeSuccess.vocation || 'مكرس/ة'} • {showWelcomeSuccess.consecrationRank}
                    </span>
                  </div>
                  <p>
                    <span className="font-semibold text-slate-600">المقر والإيبارشية:</span>{' '}
                    <span className="text-slate-800">
                      {showWelcomeSuccess.consecrationHouse} ({showWelcomeSuccess.diocese})
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-600">ميدان الخدمة:</span>{' '}
                    <span className="text-indigo-900 font-bold">{showWelcomeSuccess.ministryField}</span>
                  </p>
                  {showWelcomeSuccess.consecrationVerse && (
                    <div className="p-2 rounded-lg bg-white border border-amber-200 font-spiritual text-amber-900 text-xs">
                      {showWelcomeSuccess.consecrationVerse}
                    </div>
                  )}
                  <p className="pt-1">
                    <span className="font-semibold text-slate-600">كود الدخول المخصص:</span>{' '}
                    <span className="text-amber-700 font-mono font-black text-sm bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300 mr-1">
                      {showWelcomeSuccess.code}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSuccess(showWelcomeSuccess);
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-indigo-700 text-white font-bold hover:brightness-105 shadow-md flex items-center justify-center gap-2 cursor-pointer transition text-sm"
              >
                <span>الانتقال للمسابقة وبدء المرحلة الأولى</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ) : (
            <div>
              {/* Tabs */}
              <div className="flex rounded-2xl bg-slate-100 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-white text-indigo-950 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  تسجيل بطاقة التكريس والهوية
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white text-indigo-950 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  تسجيل الدخول بكود المشاركة
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {activeTab === 'register' ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-right">
                  {/* Category Selector: كاهن - مكرسة - راهب - راهبة */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                    <label className="block text-xs font-bold text-amber-950">
                      فئة التكريس والخدمة: <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['كاهن', 'مكرسة', 'راهب', 'راهبة'] as ConsecrationVocation[]).map((voc) => (
                        <button
                          key={voc}
                          type="button"
                          onClick={() => handleVocationChange(voc)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                            vocation === voc
                              ? 'bg-indigo-900 text-white border-indigo-950 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-100/50'
                          }`}
                        >
                          <span>{voc === 'كاهن' ? '✝️' : voc === 'راهب' ? '⛪' : voc === 'راهبة' ? '🕯️' : '🕊️'}</span>
                          <span>{voc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section A: Basic Info */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>1️⃣ البيانات الأساسية</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        الاسم المبارك {vocation === 'كاهن' ? '(أبونا...)' : vocation === 'راهب' ? '(أبونا الراهب...)' : vocation === 'راهبة' ? '(أموني / تماف...)' : '(تاسوني...)'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={vocation === 'كاهن' ? 'مثال: أبونا بيشوي كامل' : vocation === 'راهب' ? 'مثال: الراهب بيجول المقاري' : vocation === 'راهبة' ? 'مثال: تماف إيريني' : 'مثال: تاسوني مارينا القبطية'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {vocation === 'كاهن' ? 'اسم الكنيسة' : vocation === 'مكرسة' ? 'اسم الدير / بيت التكريس' : 'اسم الدير العامر'}
                        </label>
                        <input
                          type="text"
                          placeholder={vocation === 'كاهن' ? 'كنيسة مارجرجس' : vocation === 'مكرسة' ? 'بيت بنات مريم للتكريس' : 'دير السيدة العذراء السريان'}
                          value={consecrationHouse}
                          onChange={(e) => setConsecrationHouse(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          الإيبارشية
                        </label>
                        <input
                          type="text"
                          placeholder="إيبارشية بني سويف"
                          value={diocese}
                          onChange={(e) => setDiocese(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          المحافظة / الدولة
                        </label>
                        <input
                          type="text"
                          placeholder="بني سويف"
                          value={governorate}
                          onChange={(e) => setGovernorate(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          كود مخصص (اختياري)
                        </label>
                        <input
                          type="text"
                          placeholder="HQ-XXX"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section B: الهوية التكريسية والرسالة */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span>2️⃣ الهوية التكريسية وميدان الخدمة</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          رتبة التكريس / الكهنوت
                        </label>
                        <select
                          value={consecrationRank}
                          onChange={(e) => setConsecrationRank(e.target.value as ConsecrationRank)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        >
                          {vocation === 'كاهن' ? (
                            <>
                              <option value="كاهن (قس)">كاهن (قس)</option>
                              <option value="قمص">قمص</option>
                            </>
                          ) : vocation === 'راهب' ? (
                            <>
                              <option value="راهب متبتل">راهب متبتل</option>
                              <option value="راهب كاهن (قس)">راهب قس</option>
                              <option value="راهب قمص">راهب قمص</option>
                              <option value="طالب رهبنة (مبتدئ)">طالب رهبنة (مبتدئ)</option>
                            </>
                          ) : vocation === 'راهبة' ? (
                            <>
                              <option value="راهبة مكرسة">راهبة مكرسة</option>
                              <option value="طالبة رهبنة (مبتدئة)">طالبة رهبنة (مبتدئة)</option>
                            </>
                          ) : (
                            <>
                              <option value="مكرسة دائمة">مكرسة دائمة (صلوات التكريس)</option>
                              <option value="مكرسة مبتدئة">مكرسة مبتدئة</option>
                              <option value="مساعدة مكرسة">مساعدة مكرسة</option>
                              <option value="شماسة مكرسة (دياكونيسا)">شماسة مكرسة (دياكونيسا)</option>
                              <option value="خادمة متفرغة">خادمة متفرغة</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          مجال وميدان الخدمة أو العمل النسكي
                        </label>
                        <input
                          type="text"
                          value={ministryField}
                          onChange={(e) => setMinistryField(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        آية التكريس وشعار المسيرة أمام الله
                      </label>
                      <input
                        type="text"
                        placeholder="«وَجَدْتُ دَاوُدَ... رَجُلاً حَسَبَ قَلْبِي...»"
                        value={consecrationVerse}
                        onChange={(e) => setConsecrationVerse(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          شفيع التكريس أو الدير
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: القديسة مريم العذراء / مارمرقس الرسول"
                          value={patronSaint}
                          onChange={(e) => setPatronSaint(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          رمز دخول آمن (PIN اختياري)
                        </label>
                        <input
                          type="password"
                          placeholder="رمز مرور"
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        تأمل شخصي في رسالة التكريس أمام الله
                      </label>
                      <textarea
                        rows={2}
                        placeholder="أكرس حياتي لخدمة المسيح وخلاص النفوس، مع السهر على الصلاة والنمو الداخلي..."
                        value={personalBio}
                        onChange={(e) => setPersonalBio(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-800 text-white font-bold hover:brightness-105 shadow-md flex items-center justify-center gap-2 cursor-pointer transition text-sm"
                  >
                    <Cross className="w-4 h-4 text-amber-300" />
                    <span>تأكيد التسجيل والدخول لمسيرة «حسب قلب الله»</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      أدخل كود المشاركة المعتمد
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="أدخل كود المشاركة المعتمد (مثال: MK-... أو كود الإشراف)"
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value)}
                        className="w-full pr-10 pl-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute top-3 right-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-800 text-white font-bold hover:brightness-105 shadow-md flex items-center justify-center gap-2 cursor-pointer transition text-sm"
                  >
                    <span>تسجيل الدخول ومتابعة مساري</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
