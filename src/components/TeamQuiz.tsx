import React, { useState, useEffect, useRef } from 'react';
import { Question, Team, TeamRoundLog } from '../types';
import { INITIAL_TEAMS, CATEGORIES } from '../data/questions';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Users, 
  Crown, 
  Trophy, 
  Bell, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  Plus, 
  Trash2,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface TeamQuizProps {
  questionsPool: Question[];
  onBackToHome: () => void;
}

export const TeamQuiz: React.FC<TeamQuizProps> = ({
  questionsPool,
  onBackToHome,
}) => {
  const [stage, setStage] = useState<'setup' | 'playing' | 'winner'>('setup');
  
  // Teams setup
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 't-1',
      name: 'فريق أمنا سارة',
      patronSaint: 'أم البرية وشاطئ الصمت',
      score: 0,
      color: 'from-amber-600 to-amber-800',
      avatar: '🕊️',
      answeredCorrectCount: 0,
      answeredWrongCount: 0,
    },
    {
      id: 't-2',
      name: 'فريق القديسة فيرينا',
      patronSaint: 'شمعة الخدمة والرعاية ونور مصر بسويسرا',
      score: 0,
      color: 'from-blue-600 to-blue-800',
      avatar: '💧',
      answeredCorrectCount: 0,
      answeredWrongCount: 0,
    },
    {
      id: 't-3',
      name: 'فريق القديسة دميانة',
      patronSaint: 'رئيسة العذارى وتاج الإيمان',
      score: 0,
      color: 'from-rose-600 to-rose-800',
      avatar: '👑',
      answeredCorrectCount: 0,
      answeredWrongCount: 0,
    },
  ]);

  const [totalRoundsChoice, setTotalRoundsChoice] = useState<number>(6); // total questions
  const [gamePlayMode, setGamePlayMode] = useState<'turn' | 'buzzer'>('buzzer');
  
  // Game session state
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentTurnTeamIndex, setCurrentTurnTeamIndex] = useState(0); // for turn mode
  const [buzzedTeamId, setBuzzedTeamId] = useState<string | null>(null); // for buzzer mode
  const [questionTimer, setQuestionTimer] = useState<number>(30);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [logs, setLogs] = useState<TeamRoundLog[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start Team Competition
  const handleStartGame = () => {
    const shuffled = [...questionsPool].sort(() => 0.5 - Math.random());
    const count = Math.min(totalRoundsChoice, shuffled.length);
    setGameQuestions(shuffled.slice(0, count));
    setCurrentQIndex(0);
    setCurrentTurnTeamIndex(0);
    setBuzzedTeamId(null);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setQuestionTimer(30);
    setLogs([]);

    // Reset scores
    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        score: 0,
        answeredCorrectCount: 0,
        answeredWrongCount: 0,
      }))
    );

    setStage('playing');
  };

  const currentQ = gameQuestions[currentQIndex];

  // Buzzer action by a team
  const handleBuzzerClick = (teamId: string) => {
    if (stage !== 'playing' || buzzedTeamId !== null || isAnswerRevealed) return;
    soundManager.playBuzzer();
    setBuzzedTeamId(teamId);
  };

  // Turn mode or Buzzed team answer selection
  const handleAnswerClick = (optionIdx: number) => {
    if (isAnswerRevealed || !currentQ) return;

    // Determine which team is answering
    let answeringTeamId = buzzedTeamId;
    if (gamePlayMode === 'turn') {
      answeringTeamId = teams[currentTurnTeamIndex].id;
    }

    if (!answeringTeamId) return;

    setSelectedOption(optionIdx);
    setIsAnswerRevealed(true);

    const isCorrect = optionIdx === currentQ.correctIndex;
    const team = teams.find((t) => t.id === answeringTeamId);
    const teamName = team ? team.name : '';

    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    // Update Team score (+10 on correct, 0 on wrong)
    const points = isCorrect ? 10 : 0;
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === answeringTeamId) {
          return {
            ...t,
            score: t.score + points,
            answeredCorrectCount: isCorrect ? t.answeredCorrectCount + 1 : t.answeredCorrectCount,
            answeredWrongCount: !isCorrect ? t.answeredWrongCount + 1 : t.answeredWrongCount,
          };
        }
        return t;
      })
    );

    // Add log
    setLogs((prev) => [
      {
        questionId: currentQ.id,
        questionText: currentQ.question,
        teamId: answeringTeamId!,
        teamName,
        wasCorrect: isCorrect,
        pointsAwarded: points,
      },
      ...prev,
    ]);
  };

  // Next Question or Finish
  const handleNextQuestion = () => {
    if (currentQIndex + 1 < gameQuestions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setBuzzedTeamId(null);
      setQuestionTimer(30);
      setCurrentTurnTeamIndex((prev) => (prev + 1) % teams.length);
    } else {
      // Game finished
      setStage('winner');
      soundManager.playVictory();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  // Add a new team in setup
  const handleAddTeam = () => {
    if (teams.length >= 4) return;
    const defaultAvatars = ['🕊️', '💧', '👑', '📜'];
    const newId = `t-${Date.now()}`;
    const newTeam: Team = {
      id: newId,
      name: `فريق جديد ${teams.length + 1}`,
      patronSaint: 'شفيع بيت التكريس',
      score: 0,
      color: 'from-amber-700 to-amber-900',
      avatar: defaultAvatars[teams.length % defaultAvatars.length],
      answeredCorrectCount: 0,
      answeredWrongCount: 0,
    };
    setTeams([...teams, newTeam]);
  };

  // Remove a team in setup
  const handleRemoveTeam = (id: string) => {
    if (teams.length <= 2) return;
    setTeams(teams.filter((t) => t.id !== id));
  };

  // Winning team(s)
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winningTeam = sortedTeams[0];

  // -------------------------------------------------------------
  // RENDER: Setup Stage
  // -------------------------------------------------------------
  if (stage === 'setup') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-200/90 p-6 sm:p-10">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 mb-3 shadow-inner">
              <Users className="w-8 h-8 text-amber-800" />
            </div>
            <h1 className="font-spiritual text-3xl font-bold text-stone-900">
              المسابقة الجماعية لبيوت التكريس والفرق
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              تنافس تفاعلي شيق بين فرق المكرسات مع لوحة نتائج حية ونظام الأجراس والتحكيم
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Gameplay mode selection */}
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">
                نظام المسابقة الجماعية
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGamePlayMode('buzzer')}
                  className={`p-4 rounded-2xl border text-right transition-all ${
                    gamePlayMode === 'buzzer'
                      ? 'border-amber-700 bg-amber-50 ring-1 ring-amber-700 shadow-sm'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-base mb-1">
                    <Bell className="w-4 h-4 text-amber-700" />
                    <span>نظام جرس السرعة (Buzzer)</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    يظهر السؤال للجميع، والفريق الذي يضغط زر الجرس أولاً يحصل على حق الإجابة واقتناص النقاط.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setGamePlayMode('turn')}
                  className={`p-4 rounded-2xl border text-right transition-all ${
                    gamePlayMode === 'turn'
                      ? 'border-amber-700 bg-amber-50 ring-1 ring-amber-700 shadow-sm'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-base mb-1">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>نظام التناوب الدوري (Turn-Based)</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    يحصل كل فريق على سؤاله الخاص بالتوالي بنظام الجولات العادلة.
                  </p>
                </button>
              </div>
            </div>

            {/* Rounds count */}
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">
                عدد الأسئلة الإجمالي في المنافسة
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[6, 9, 12, 16].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setTotalRoundsChoice(cnt)}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                      totalRoundsChoice === cnt
                        ? 'bg-amber-800 text-amber-50 border-amber-800 shadow-sm'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {cnt} أسئلة
                  </button>
                ))}
              </div>
            </div>

            {/* Teams List Configuration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-stone-800">
                  الفرق المتنافسة (2 إلى 4 فرق)
                </label>
                {teams.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddTeam}
                    className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-100/70 px-3 py-1.5 rounded-lg border border-amber-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة فريق</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teams.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/70 flex items-center gap-3"
                  >
                    <span className="text-2xl p-2 rounded-xl bg-white shadow-2xs border border-stone-200">
                      {t.avatar}
                    </span>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTeams((prev) =>
                            prev.map((item) => (item.id === t.id ? { ...item, name: val } : item))
                          );
                        }}
                        placeholder={`اسم الفريق ${idx + 1}`}
                        className="w-full text-sm font-bold text-stone-900 bg-transparent border-b border-stone-300 focus:border-amber-700 outline-none pb-0.5"
                      />
                      <input
                        type="text"
                        value={t.patronSaint}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTeams((prev) =>
                            prev.map((item) => (item.id === t.id ? { ...item, patronSaint: val } : item))
                          );
                        }}
                        placeholder="الشفيع أو الشعار"
                        className="w-full text-xs text-stone-500 bg-transparent border-none outline-none mt-1"
                      />
                    </div>
                    {teams.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTeam(t.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                        title="حذف الفريق"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-200">
              <button
                type="button"
                onClick={onBackToHome}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-sm transition-colors"
              >
                رجوع للرئيسية
              </button>

              <button
                type="button"
                onClick={handleStartGame}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>بدء المنافسة الجماعية</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Active Playing Stage
  // -------------------------------------------------------------
  if (stage === 'playing' && currentQ) {
    const categoryInfo = CATEGORIES.find((c) => c.id === currentQ.category);
    const activeAnsweringTeam = gamePlayMode === 'buzzer' 
      ? teams.find((t) => t.id === buzzedTeamId) 
      : teams[currentTurnTeamIndex];

    return (
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Live Scoreboard Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {teams.map((t, idx) => {
            const isTurn = gamePlayMode === 'turn' && idx === currentTurnTeamIndex;
            const isBuzzed = gamePlayMode === 'buzzer' && buzzedTeamId === t.id;

            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isBuzzed || isTurn
                    ? 'border-amber-600 bg-amber-50/90 shadow-md ring-2 ring-amber-500/30'
                    : 'border-stone-200 bg-white shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{t.avatar}</span>
                  <span className="font-spiritual text-2xl font-bold text-amber-900">
                    {t.score} نقطة
                  </span>
                </div>
                <h4 className="font-bold text-xs text-stone-900 truncate">
                  {t.name}
                </h4>
                <p className="text-[10px] text-stone-500 truncate">
                  صائب: {t.answeredCorrectCount} · خطأ: {t.answeredWrongCount}
                </p>
              </div>
            );
          })}
        </div>

        {/* Current Round Header */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-spiritual text-lg font-bold text-stone-900">
              الجولة {currentQIndex + 1} من {gameQuestions.length}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full ${categoryInfo?.colorScheme.bgBadge || 'bg-stone-100 text-stone-800'}`}>
              {categoryInfo?.title}
            </span>
          </div>

          {/* Answering indicator */}
          <div className="text-xs font-semibold text-stone-700 flex items-center gap-2">
            {gamePlayMode === 'buzzer' ? (
              buzzedTeamId ? (
                <span className="text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                  <Bell className="w-3.5 h-3.5" />
                  دور الإجابة لـ: {activeAnsweringTeam?.name}
                </span>
              ) : (
                <span className="text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  في انتظار قرع جرس السرعة من أحد الفرق...
                </span>
              )
            ) : (
              <span className="text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-bold">
                السؤال موجه لـ: {activeAnsweringTeam?.name}
              </span>
            )}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-amber-200/90 p-6 sm:p-10 mb-6 relative">
          
          <h2 className="font-spiritual text-2xl sm:text-3xl font-bold text-stone-900 leading-relaxed mb-8">
            {currentQ.question}
          </h2>

          {/* Buzzer Buttons (when in Buzzer mode and no team has buzzed yet) */}
          {gamePlayMode === 'buzzer' && !buzzedTeamId && !isAnswerRevealed && (
            <div className="mb-8 p-6 rounded-2xl bg-amber-50/70 border border-amber-300 text-center">
              <p className="text-sm font-bold text-amber-950 mb-4">
                أي فريق مستعد للإجابة؟ اضغط جرس فريقك الآن!
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {teams.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleBuzzerClick(t.id)}
                    className="p-4 rounded-xl bg-gradient-to-b from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-sm shadow-md hover:scale-103 transition-transform flex flex-col items-center gap-1.5"
                  >
                    <Bell className="w-6 h-6 text-amber-200 animate-bounce" />
                    <span>جرس {t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;
              const canClick = (gamePlayMode === 'turn' || buzzedTeamId !== null) && !isAnswerRevealed;

              let btnStyle = 'border-stone-200 bg-stone-50/50 text-stone-800';

              if (canClick) {
                btnStyle += ' hover:bg-amber-50/60 hover:border-amber-300 cursor-pointer';
              } else if (!isAnswerRevealed) {
                btnStyle += ' opacity-70 cursor-not-allowed';
              }

              if (isAnswerRevealed) {
                if (isCorrectAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/30';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/30 line-through opacity-80';
                } else {
                  btnStyle = 'border-stone-200 bg-stone-100 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => canClick && handleAnswerClick(idx)}
                  disabled={!canClick}
                  className={`p-5 rounded-2xl border text-right transition-all flex items-start gap-3.5 text-base sm:text-lg font-spiritual ${btnStyle}`}
                >
                  <span className="w-8 h-8 rounded-xl bg-white border border-stone-300 text-stone-700 flex items-center justify-center font-sans text-sm font-bold shrink-0 mt-0.5">
                    {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}
                  </span>
                  <span className="flex-1 leading-normal pt-0.5">
                    {option}
                  </span>
                  {isAnswerRevealed && isCorrectAnswer && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                  )}
                  {isAnswerRevealed && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post Answer Feedback & Next Action */}
          {isAnswerRevealed && (
            <div className="mt-8 p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-stone-900 mb-1">
                    التوثيق والبيان الكنسي:
                  </h3>
                  <p className="text-stone-700 text-sm font-spiritual leading-relaxed mb-2">
                    {currentQ.explanation}
                  </p>
                  <p className="text-xs text-stone-500 font-sans">
                    المرجع: {currentQ.reference}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>{currentQIndex + 1 < gameQuestions.length ? 'الجولة التالية' : 'إعلان الفريق الفائز'}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Winner Podium Stage
  // -------------------------------------------------------------
  if (stage === 'winner') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-200 p-6 sm:p-10 text-center">
          
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-900 text-amber-100 shadow-xl mb-4">
            <Trophy className="w-12 h-12" />
          </div>

          <h1 className="font-spiritual text-3xl sm:text-4xl font-bold text-stone-900 mb-1">
            مبروك فوز {winningTeam.name}!
          </h1>
          <p className="text-stone-600 text-sm mb-6">
            تتويج بـ «درع التفوق التكريسي لبيوت المكرسات» بالمركز الأول
          </p>

          {/* Podium ranking */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            {sortedTeams.map((team, rank) => (
              <div
                key={team.id}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  rank === 0
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/30 shadow-md order-first sm:order-2 sm:-translate-y-2'
                    : 'border-stone-200 bg-stone-50/50 order-2 sm:order-1'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-stone-500 mb-2">
                  {rank === 0 && <Crown className="w-4 h-4 text-amber-600" />}
                  <span>المركز {rank === 0 ? 'الأول 🥇' : rank === 1 ? 'الثاني 🥈' : 'الثالث 🥉'}</span>
                </div>
                <div className="text-3xl mb-1">{team.avatar}</div>
                <h3 className="font-spiritual text-xl font-bold text-stone-900">
                  {team.name}
                </h3>
                <p className="font-spiritual text-2xl font-bold text-amber-900 my-1">
                  {team.score} نقطة
                </p>
                <p className="text-[11px] text-stone-500">
                  {team.patronSaint}
                </p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleStartGame}
              className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>جولة تنافسية جديدة</span>
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="px-6 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm transition-colors"
            >
              الرئيسية
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
};
