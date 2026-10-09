import React, { useState } from 'react';
import { User, ConsecrationRank } from '../types';
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

  // Basic Info
  const [name, setName] = useState('');
  const [consecrationHouse, setConsecrationHouse] = useState('بيت بنات مريم للتكريس');
  const [diocese, setDiocese] = useState('إيبارشية بني سويف');
  const [governorate, setGovernorate] = useState('بني سويف');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');

  // Identity & Ministry Info (فقرة تعريف المكرسة وهويتها وخدمتها)
  const [consecrationRank, setConsecrationRank] = useState<ConsecrationRank>('مكرسة دائمة');
  const [ministryField, setMinistryField] = useState('خدمة المغتربات والجامعيات');
  const [consecrationVerse, setConsecrationVerse] = useState(
    '«إِنَّمَا الْحَاجَةُ إِلَى وَاحِدٍ؛ فَاخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ» (لو 10: 42)'
  );
  const [patronSaint, setPatronSaint] = useState('القديسة مريم العذراء');
  const [personalBio, setPersonalBio] = useState(
    'أكرس حياتي وحبي لخدمة المسيح وخلاص النفوس في الكنيسة، مع السهر على الصلاة والعمل الروحي.'
  );

  // Login Form
  const [loginCode, setLoginCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showWelcomeSuccess, setShowWelcomeSuccess] = useState<User | null>(null);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('يرجى إدخال اسم المكرسة أو الخادمة');
      return;
    }
    setErrorMessage('');

    try {
      soundManager.playVictory();
      const user = registerParticipant({
        name,
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
        'كود المشاركة غير مسجل. يرجى التأكد من كتابة الكود بشكل صحيح أو إنشاء حساب متسابقة جديدة.'
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
            <Award className="w-8 h-8 text-amber-200" />
          </div>
          <h2 className="text-xl font-bold font-spiritual tracking-wide">🏆 المكرَّسة المثالية</h2>
          <p className="text-xs text-amber-100 mt-1">
            تسجيل المتسابقة والتعريف بالهوية والخدمة الكنسية
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
                <h3 className="text-xl font-bold text-slate-800">تم تسجيلكِ بنجاح مبارك!</h3>
                <p className="text-sm text-emerald-800 font-semibold bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-200">
                  «استعدي للجولة الأولى من المسابقة!»
                </p>

                {/* Identity Summary Card */}
                <div className="bg-gradient-to-b from-amber-50 to-white p-4 rounded-2xl border border-amber-200 text-right text-xs space-y-2 mt-3">
                  <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                    <span className="font-bold text-slate-800 text-sm">{showWelcomeSuccess.name}</span>
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      {showWelcomeSuccess.consecrationRank}
                    </span>
                  </div>
                  <p>
                    <span className="font-semibold text-slate-600">بيت التكريس والإيبارشية:</span>{' '}
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
                  تسجيل متسابقة وبطاقة الهوية
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
                  {/* Section A: Basic Info */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>1️⃣ البيانات الأساسية</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        اسم المكرسة / الخادمة <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: تاسوني مارينا القبطية"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          اسم الدير / بيت التكريس
                        </label>
                        <input
                          type="text"
                          placeholder="بيت بنات مريم للتكريس"
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
                          المحافظة
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
                          كود مشاركة اختياري
                        </label>
                        <input
                          type="text"
                          placeholder="MK-XXX"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section B: فقرة تعريف المكرسة وهويتها وخدمتها ورسالتها */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span>2️⃣ تعريف المكرسة بهويتها وخدمتها ورسالتها</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          رتبة التكريس الكنسية
                        </label>
                        <select
                          value={consecrationRank}
                          onChange={(e) => setConsecrationRank(e.target.value as ConsecrationRank)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="مكرسة دائمة">مكرسة دائمة (صلوات التكريس)</option>
                          <option value="مكرسة مبتدئة">مكرسة مبتدئة</option>
                          <option value="مساعدة مكرسة">مساعدة مكرسة</option>
                          <option value="شماسة مكرسة (دياكونيسا)">شماسة مكرسة (دياكونيسا)</option>
                          <option value="خادمة متفرغة">خادمة متفرغة</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          مجال وميدان الخدمة الرئيسي
                        </label>
                        <select
                          value={ministryField}
                          onChange={(e) => setMinistryField(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="خدمة المغتربات والجامعيات">خدمة المغتربات والجامعيات</option>
                          <option value="رعاية الأيتام والملاجئ">رعاية الأيتام والملاجئ</option>
                          <option value="خدمة المرضى والمستشفيات">خدمة المرضى والمستشفيات</option>
                          <option value="التعليم والمدارس القبطية">التعليم والمدارس القبطية</option>
                          <option value="خدمة القرى والافتقاد الرعوي">خدمة القرى والافتقاد الرعوي</option>
                          <option value="التوثيق والأيقونة والخياطة الكنسية">التوثيق والأيقونة والخياطة الكنسية</option>
                          <option value="المكتبات والمخطوطات وإعداد القربان">المكتبات والمخطوطات وإعداد القربان</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        آية التكريس وشعار حياتكِ
                      </label>
                      <input
                        type="text"
                        placeholder="«إِنَّمَا الْحَاجَةُ إِلَى وَاحِدٍ...»"
                        value={consecrationVerse}
                        onChange={(e) => setConsecrationVerse(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          شفيعة التكريس
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: القديسة مريم العذراء"
                          value={patronSaint}
                          onChange={(e) => setPatronSaint(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          رمز دخول آمن (PIN)
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
                        كلمة قصيرة تعرفين بها نفسكِ ورسالتكِ في التكريس
                      </label>
                      <textarea
                        rows={2}
                        placeholder="أكرس حياتي لخدمة المسيح وخلاص النفوس..."
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
                    <UserCheck className="w-4 h-4" />
                    <span>تأكيد التسجيل وحفظ بطاقة الهوية</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      أدخلي كود المشاركة الخاص بكِ
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="أدخلي كود مشاركتكِ المعتمد (مثال: MK-... أو كود المشرفة)"
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
