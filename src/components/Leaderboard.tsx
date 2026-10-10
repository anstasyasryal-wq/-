import React from 'react';
import { SoloQuizResult } from '../types';
import { Trophy, Award, Calendar, ChevronLeft, Trash2, ShieldCheck, Printer } from 'lucide-react';

interface LeaderboardProps {
  results: SoloQuizResult[];
  onOpenCertificate: (result: SoloQuizResult) => void;
  onClearHistory: () => void;
  onBackToHome: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  results,
  onOpenCertificate,
  onClearHistory,
  onBackToHome,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-stone-900">
                لوحة الشرف وسجل التقدير
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-sans">
                سجل إنجازات المشاركين الحاصلين على الأوسمة وشهادات التقدير الكنسية
              </p>
            </div>
          </div>

          {results.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح السجل</span>
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
          <Award className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-spiritual text-xl font-bold text-stone-800 mb-1">
            لا توجد سجلات بعد في لوحة الشرف
          </h3>
          <p className="text-stone-500 text-sm mb-6">
            شارك في المراجعة الفردية لمسيرة «حسب قلب الله» لتسجيل نتيجتك ونيل شهادة التقدير الكنسية!
          </p>
          <button
            type="button"
            onClick={onBackToHome}
            className="px-6 py-2.5 rounded-xl bg-amber-800 text-white font-bold text-sm"
          >
            الانتقال للمسابقات
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 text-xs font-bold font-sans">
                <tr>
                  <th className="py-4 px-6">المشارك/ة</th>
                  <th className="py-4 px-6">المقر الكنسي / الإيبارشية</th>
                  <th className="py-4 px-6">النسبة والدرجة</th>
                  <th className="py-4 px-6">الوسام الممنوح</th>
                  <th className="py-4 px-6">التاريخ</th>
                  <th className="py-4 px-6 text-center">الشهادة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {results.map((res) => (
                  <tr key={res.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-spiritual text-base font-bold text-stone-900">
                        {res.participantName}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-stone-600 text-xs">
                      {res.houseOrDiocese || 'غير محدد'}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-spiritual text-lg font-bold text-amber-900">
                          {res.percentage}%
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                          {res.grade}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-spiritual text-sm font-semibold text-stone-800">
                        {res.titleAwarded}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-stone-400 text-xs whitespace-nowrap">
                      {new Date(res.date).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenCertificate(res)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors shadow-2xs"
                        title="عرض وطباعة الشهادة"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        <span>عرض الشهادة</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
