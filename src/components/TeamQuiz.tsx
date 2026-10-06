import React, { useState, useEffect, useRef } from 'react';
import { Question, Team, TeamRoundLog } from '../types';
import { CATEGORIES } from '../data/questions';
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
  BookOpen, 
  Printer, 
  X, 
  ShieldCheck, 
  Zap, 
  Sliders
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
      name: 'فريق بيت بنات مريم للتكريس',
      consecrationHouse: 'إيبارشية بني سويف',
      members: 'تاسوني مارينا، تاسوني فيرينا، تاسوني يوستينا',
      patronSaint: 'القديسة العذراء مريم',
      score: 0,
      color: 'from-amber-600 to-amber-800',
      avatar: '🕊️',
      answeredCorrectCount: 0,
      answeredWrongCount: 0,
    },
    {
      id: 't-2',
      name: 'فريق بيت الشماسة فيبي',
      consecrationHouse: 'إيبارشية القاهرة والخدمة',
      members: 'تاسوني أوفيميا، تاسوني إيرين، تاسوني صوفيا',
      patronSaint: 'القديسة فيبي الشماسة',
      score: 0,
      color: 'from-blue-600 to-blue-800',
      avatar: '📜',
      answeredCorrectCount: 0,
      answeredWrongCount: 0,
    },
    {
      id: 't-3',
      name: 'فريق بيت القديسة دميانة',
      consecrationHouse: 'إيبارشية الدلتا والبراري',
      members: 'تاسوني دميانة، تاسوني كاترين، تاسوني أغابي',
      patronSaint: 'القديسة دميانة ورئيسة العذارى',
      score: 0,
      color: 'from-rose-600 to-rose-800',
      avatar: '👑',
      answeredCorrectCount: 0,
      answeredWrongCount: 0,
    },
  ]);

  const [totalRoundsChoice, setTotalRoundsChoice] = useState<number>(6); // total questions
  const [gamePlayMode, setGamePlayMode] = useState<'turn' | 'buzzer'>('turn');
  const [enableStealing, setEnableStealing] = useState<boolean>(true);
  
  // Game session state
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentTurnTeamIndex, setCurrentTurnTeamIndex] = useState(0); // for turn mode
  const [buzzedTeamId, setBuzzedTeamId] = useState<string | null>(null); // for buzzer mode
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [stealingActive, setStealingActive] = useState(false);
  const [stolenByTeamId, setStolenByTeamId] = useState<string | null>(null);
  const [showRefereePanel, setShowRefereePanel] = useState(false);
  const [showTrophyCertificate, setShowTrophyCertificate] = useState(false);

  // Load Preset Houses
  const handleLoadPresetHouses = () => {
    setTeams([
      {
        id: 't-1',
        name: 'بيت بنات مريم للتكريس',
        consecrationHouse: 'إيبارشية بني سويف',
        members: 'تاسوني مارينا، تاسوني فيرينا، تاسوني يوستينا',
        patronSaint: 'القديسة مريم العذراء',
        score: 0,
        color: 'from-amber-600 to-amber-800',
        avatar: '🕊️',
        answeredCorrectCount: 0,
        answeredWrongCount: 0,
      },
      {
        id: 't-2',
        name: 'بيت الشماسة فيبي للتكريس',
        consecrationHouse: 'إيبارشية القاهرة',
        members: 'تاسوني أوفيميا، تاسوني إيرين، تاسوني صوفيا',
        patronSaint: 'القديسة فيبي الشماسة',
        score: 0,
        color: 'from-blue-600 to-blue-800',
        avatar: '📜',
        answeredCorrectCount: 0,
        answeredWrongCount: 0,
      },
      {
        id: 't-3',
        name: 'بيت القديسة دميانة للمكرسات',
        consecrationHouse: 'إيبارشية الدلتا',
        members: 'تاسوني دميانة، تاسوني كاترين، تاسوني أغابي',
        patronSaint: 'القديسة دميانة',
        score: 0,
        color: 'from-rose-600 to-rose-800',
        avatar: '👑',
        answeredCorrectCount: 0,
        answeredWrongCount: 0,
      },
      {
        id: 't-4',
        name: 'بيت القديسة فيرينا للرعاية',
        consecrationHouse: 'إيبارشية الإسكندرية',
        members: 'تاسوني سارة، تاسوني مريم، تاسوني فيلومينا',
        patronSaint: 'القديسة فيرينا',
        score: 0,
        color: 'from-emerald-600 to-emerald-800',
        avatar: '💧',
        answeredCorrectCount: 0,
        answeredWrongCount: 0,
      },
    ]);
  };

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
    setStealingActive(false);
    setStolenByTeamId(null);

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

  // Buzzer action
  const handleBuzzerClick = (teamId: string) => {
    if (stage !== 'playing' || buzzedTeamId !== null || isAnswerRevealed) return;
    soundManager.playBuzzer();
    setBuzzedTeamId(teamId);
  };

  // Stealing buzzer
  const handleStealBuzzer = (teamId: string) => {
    if (!stealingActive || stolenByTeamId !== null) return;
    soundManager.playBuzzer();
    setStolenByTeamId(teamId);
  };

  // Selecting Answer
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

    if (isCorrect) {
      soundManager.playCorrect();
      // Award 10 points
      setTeams((prev) =>
        prev.map((t) =>
          t.id === answeringTeamId
            ? { ...t, score: t.score + 10, answeredCorrectCount: t.answeredCorrectCount + 1 }
            : t
        )
      );
      setStealingActive(false);
    } else {
      soundManager.playWrong();
      setTeams((prev) =>
        prev.map((t) =>
          t.id === answeringTeamId
            ? { ...t, answeredWrongCount: t.answeredWrongCount + 1 }
            : t
        )
      );

      // Trigger Stealing if enabled
      if (enableStealing && teams.length > 1) {
        setStealingActive(true);
      }
    }
  };

  // Stealing answer submit
  const handleStealAnswerClick = (optionIdx: number) => {
    if (!stolenByTeamId || !currentQ) return;

    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) {
      soundManager.playVictory();
      setTeams((prev) =>
        prev.map((t) =>
          t.id === stolenByTeamId
            ? { ...t, score: t.score + 5, answeredCorrectCount: t.answeredCorrectCount + 1 }
            : t
        )
      );
    } else {
      soundManager.playWrong();
    }
    setStealingActive(false);
  };

  // Referee manual score adjustment
  const handleAdjustScore = (teamId: string, delta: number) => {
    soundManager.playTick();
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t))
    );
  };

  // Next Question or Finish
  const handleNextQuestion = () => {
    if (currentQIndex + 1 < gameQuestions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setBuzzedTeamId(null);
      setStealingActive(false);
      setStolenByTeamId(null);
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

  // Add / remove team in setup
  const handleAddTeam = () => {
    if (teams.length >= 4) return;
    const defaultAvatars = ['🕊️', '📜', '👑', '💧'];
    const newId = `t-${Date.now()}`;
    const newTeam: Team = {
      id: newId,
      name: `بيت تكريس جديد ${teams.length + 1}`,
      consecrationHouse: 'إيبارشية كنسية',
      members: 'تاسوني، تاسوني',
      patronSaint: 'شفيعة مباركة',
      score: 0,
      color: 'from-amber-700 to-amber-900',
      avatar: defaultAvatars[teams.length % defaultAvatars.length],
      answeredCorrectCount: 0,
      answeredWrongCount: 0,
    };
    setTeams([...teams, newTeam]);
  };

  const handleRemoveTeam = (id: string) => {
    if (teams.length <= 2) return;
    setTeams(teams.filter((t) => t.id !== id));
  };

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
              دوري بيوت التكريس والفرق الكنسية
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              تنافس تفاعلي موثق بين بيوت التكريس والإيبارشيات مع نظام الأجراس، خطف الأسئلة، واستخراج درع التفوق
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Presets Button */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-xs text-amber-950 mb-0.5">
                  قوالب بيوت ومجموعات التكريس الكنسية
                </p>
                <p className="text-xs text-stone-600">
                  تحميل أسماء بيوت التكريس الشهيرة (بني سويف، القاهرة، الدلتا، الإسكندرية) بضغطة واحدة.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadPresetHouses}
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-xs"
              >
                تحميل بيوت التكريس المعتمدة
              </button>
            </div>

            {/* Gameplay mode selection */}
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">
                نظام المسابقة الجماعية
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    يحصل كل بيت تكريس على سؤاله الخاص بالتناوب العادل، مع إمكانية خطف السؤال في حال الخطأ.
                  </p>
                </button>

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
                    يُعرض السؤال لجميع الفرق، وأول بيت تكريس يقرع الجرس يحصل على حق الإجابة.
                  </p>
                </button>
              </div>
            </div>

            {/* Question count & Stealing toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                  عدد أسئلة الدوري
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

              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                  خاصية خطف السؤال (Stealing Points)
                </label>
                <button
                  type="button"
                  onClick={() => setEnableStealing(!enableStealing)}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    enableStealing
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-stone-100 border-stone-300 text-stone-600'
                  }`}
                >
                  <span>{enableStealing ? 'مفعلة: يحق للفرق الأخرى خطف السؤال (+5 نقاط)' : 'معطلة: لا يوجد خطف'}</span>
                  <Zap className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            </div>

            {/* Teams Configuration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-stone-800">
                  بيوت ومجموعات التكريس المشاركة (2 إلى 4 فرق)
                </label>
                {teams.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddTeam}
                    className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-100/70 px-3 py-1.5 rounded-lg border border-amber-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة بيت تكريس</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teams.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl p-1.5 rounded-xl bg-white shadow-2xs border border-stone-200">
                        {t.avatar}
                      </span>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTeams((prev) =>
                            prev.map((item) => (item.id === t.id ? { ...item, name: val } : item))
                          );
                        }}
                        placeholder={`اسم بيت التكريس ${idx + 1}`}
                        className="flex-1 text-sm font-bold text-stone-900 bg-transparent border-b border-stone-300 focus:border-amber-700 outline-none pb-0.5"
                      />
                      {teams.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTeam(t.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded-lg"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={t.consecrationHouse || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTeams((prev) =>
                            prev.map((item) => (item.id === t.id ? { ...item, consecrationHouse: val } : item))
                          );
                        }}
                        placeholder="الإيبارشية / المقر"
                        className="px-2 py-1 rounded-lg border border-stone-200 bg-white"
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
                        placeholder="الشفيعة"
                        className="px-2 py-1 rounded-lg border border-stone-200 bg-white"
                      />
                    </div>

                    <input
                      type="text"
                      value={t.members || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTeams((prev) =>
                          prev.map((item) => (item.id === t.id ? { ...item, members: val } : item))
                        );
                      }}
                      placeholder="أسماء المكرسات المشاركات (مثال: تاسوني مارينا، تاسوني فيرينا)"
                      className="w-full text-xs px-2 py-1 rounded-lg border border-stone-200 bg-white"
                    />
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
                <span>بدء دوري بيوت التكريس</span>
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
                className={`p-3.5 rounded-2xl border transition-all relative ${
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
                  {t.consecrationHouse || t.patronSaint}
                </p>

                {/* Referee quick adjustments */}
                {showRefereePanel && (
                  <div className="mt-2 pt-1 border-t border-stone-200 flex justify-between gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleAdjustScore(t.id, 5)}
                      className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold"
                    >
                      +5 نقاط
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustScore(t.id, -5)}
                      className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold"
                    >
                      -5 نقاط
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current Round Header & Referee Toggle */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-spiritual text-lg font-bold text-stone-900">
              الجولة {currentQIndex + 1} من {gameQuestions.length}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full ${categoryInfo?.colorScheme.bgBadge || 'bg-stone-100 text-stone-800'}`}>
              {categoryInfo?.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-stone-700">
              {gamePlayMode === 'buzzer' ? (
                buzzedTeamId ? (
                  <span className="text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                    <Bell className="w-3.5 h-3.5" />
                    دور: {activeAnsweringTeam?.name}
                  </span>
                ) : (
                  <span className="text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                    في انتظار جرس أحد الفرق...
                  </span>
                )
              ) : (
                <span className="text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-bold">
                  السؤال لـ: {activeAnsweringTeam?.name}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowRefereePanel(!showRefereePanel)}
              className="p-1.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs"
              title="لوحة تحكيم المشرف"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-amber-200/90 p-6 sm:p-10 mb-6 relative">
          
          <h2 className="font-spiritual text-2xl sm:text-3xl font-bold text-stone-900 leading-relaxed mb-8">
            {currentQ.question}
          </h2>

          {/* Stealing Banner Alert */}
          {stealingActive && (
            <div className="mb-6 p-5 rounded-2xl bg-amber-500/15 border-2 border-dashed border-amber-600 text-center animate-pulse">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-800 text-white mb-2 inline-block">
                ⚡ فرصة خطف السؤال مفتوحة للفرق الأخرى (+5 نقاط)!
              </span>
              <p className="font-spiritual text-base font-bold text-amber-950 mb-3">
                اضغط جرس فريقكِ لخطف السؤال وتقديم الإجابة البديلة!
              </p>

              {!stolenByTeamId ? (
                <div className="flex flex-wrap justify-center gap-3">
                  {teams
                    .filter((t) => t.id !== (gamePlayMode === 'turn' ? teams[currentTurnTeamIndex].id : buzzedTeamId))
                    .map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleStealBuzzer(t.id)}
                        className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                      >
                        <Bell className="w-4 h-4 text-amber-200" />
                        <span>خطف لـ {t.name}</span>
                      </button>
                    ))}
                </div>
              ) : (
                <div className="text-xs font-bold text-emerald-800">
                  تم الخطف بواسطة: <strong>{teams.find((t) => t.id === stolenByTeamId)?.name}</strong>! اختاروا الإجابة أدناه:
                </div>
              )}
            </div>
          )}

          {/* Buzzer Buttons (when in Buzzer mode and no team buzzed yet) */}
          {gamePlayMode === 'buzzer' && !buzzedTeamId && !isAnswerRevealed && (
            <div className="mb-8 p-6 rounded-2xl bg-amber-50/70 border border-amber-300 text-center">
              <p className="text-sm font-bold text-amber-950 mb-4">
                أي بيت تكريس مستعد للإجابة؟ اضغط جرس فريقك الآن!
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
              const canStealClick = stealingActive && stolenByTeamId !== null;

              let btnStyle = 'border-stone-200 bg-stone-50/50 text-stone-800';

              if (canClick || canStealClick) {
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
                  onClick={() => {
                    if (canStealClick) {
                      handleStealAnswerClick(idx);
                    } else if (canClick) {
                      handleAnswerClick(idx);
                    }
                  }}
                  disabled={!canClick && !canStealClick}
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
                  <span>{currentQIndex + 1 < gameQuestions.length ? 'الجولة التالية' : 'إعلان البيت الفائز'}</span>
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
            تتويج {winningTeam.name}!
          </h1>
          <p className="text-stone-600 text-sm mb-6">
            الفائز بالمركز الأول في دوري بيوت ومجموعات التكريس بـ {winningTeam.score} نقطة
          </p>

          {/* Podium ranking */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            {sortedTeams.slice(0, 3).map((team, rank) => (
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
                  {team.consecrationHouse || team.patronSaint}
                </p>
                {team.members && (
                  <p className="text-[10px] text-stone-400 mt-1 truncate">
                    {team.members}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons (Trophy Certificate + Retake) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setShowTrophyCertificate(true)}
              className="px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>استخراج شهادة درع التكريس الذهبي</span>
            </button>

            <button
              type="button"
              onClick={handleStartGame}
              className="px-6 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>دوري جديد</span>
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm transition-colors"
            >
              الرئيسية
            </button>
          </div>

        </div>

        {/* Printable Consecration House Championship Certificate Modal */}
        {showTrophyCertificate && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-4xl bg-amber-50 rounded-2xl shadow-2xl overflow-hidden border border-amber-300">
              
              <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100">
                <span className="font-bold text-sm">شهادة درع التفوق لبيوت التكريس</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الدرع</span>
                  </button>
                  <button
                    onClick={() => setShowTrophyCertificate(false)}
                    className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Certificate Area */}
              <div id="printable-certificate" className="p-8 sm:p-12 bg-[#fdfbf7] text-stone-900 text-center">
                <div className="border-4 border-amber-800 p-4 rounded-lg">
                  <div className="border-2 border-dashed border-amber-600 p-8 rounded-sm bg-[#fffdf9]">
                    
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="text-xs tracking-widest text-stone-500 font-sans uppercase">
                      دوري بيوت التكريس والشمامسة
                    </p>
                    <h1 className="font-spiritual text-3xl sm:text-4xl font-bold text-amber-950 my-2">
                      درع التكريس الذهبي للتفوق الجماعي
                    </h1>

                    <p className="font-spiritual text-lg text-amber-900 italic my-4">
                      «مَا أَحْسَنَ وَمَا أَجْمَلَ أَنْ يَسْكُنَ الإِخْوَةُ مَعاً» (مزمور 133: 1)
                    </p>

                    <p className="text-stone-700 text-sm mt-4">
                      يُمنح هذا الدرع التكريمي الرفيع تقديراً لفوز وتفوق:
                    </p>

                    <h2 className="font-spiritual text-3xl font-bold text-stone-900 my-2">
                      {winningTeam.name}
                    </h2>

                    <p className="text-stone-600 text-sm font-sans mb-2">
                      {winningTeam.consecrationHouse && `التابع لـ: ${winningTeam.consecrationHouse}`}
                    </p>

                    {winningTeam.members && (
                      <p className="text-xs text-stone-500 font-spiritual max-w-lg mx-auto mb-4">
                        المكرسات المشاركات: {winningTeam.members}
                      </p>
                    )}

                    <div className="inline-block p-3 px-6 rounded-2xl bg-amber-100 border border-amber-300 font-spiritual text-xl font-bold text-amber-950 my-4">
                      الدرجة المحققة: {winningTeam.score} نقطة في العلوم الرهبانية والكنسية
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-amber-200 text-xs font-spiritual font-bold text-stone-800">
                      <div>
                        لجنة التحكيم الكنسية
                        <div className="mt-2 text-stone-500 font-normal">معتمد وموثق</div>
                      </div>
                      <div>
                        رئاسة بيت التكريس العام
                        <div className="mt-2 text-stone-500 font-normal">خاتم المسابقة الرسمية</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  return null;
};
