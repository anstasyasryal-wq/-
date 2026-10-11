import React, { useState, useEffect, useRef } from 'react';
import { User, ConsecrationVocation } from '../types';
import { SpiritualFatherAvatar } from './SpiritualFatherAvatar';
import { spiritualVoiceService } from '../utils/spiritualVoice';
import {
  SPIRITUAL_PROMPT_SUGGESTIONS,
  findLocalSpiritualGuidance,
  FormattedSpiritualResponse,
} from '../data/spiritualGuideWisdom';
import {
  X,
  Send,
  Sparkles,
  BookOpen,
  Heart,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  ShieldCheck,
  AlertTriangle,
  Flame,
  HelpCircle,
  WifiOff,
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export interface SpiritualGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'father';
  text: string;
  timestamp: string;
  structured?: FormattedSpiritualResponse;
}

export const SpiritualGuideModal: React.FC<SpiritualGuideModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const isOnline = useOnlineStatus();
  const [inputText, setInputText] = useState('');
  const [dialect, setDialect] = useState<'standard' | 'egyptian'>('egyptian');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMotionEnabled, setIsMotionEnabled] = useState(true);
  const [isLipSyncOpen, setIsLipSyncOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with fatherly blessing tailored to vocation
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const defaultWelcome: FormattedSpiritualResponse = {
      paternalAdvice:
        'سلام ومحبة ونعمة من ربنا يسوع المسيح تملأ قلبك وفكرك. أنا رفيقك الرقمي في مسيرة «حَسَبَ قَلْبِ اللهِ»، هنا لأرافقك في التأمل الروحي، ومراجعة نصوص كنيستنا، والاستعداد لمراحل المسابقة الست بكل فرح وسلام.',
      biblicalVerse: '«وَسَلاَمُ اللهِ الَّذِي يَفُوقُ كُلَّ عَقْلٍ، يَحْفَظُ قُلُوبَكُمْ وَأَفْكَارَكُمْ فِي الْمَسِيحِ يَسُوعَ» (فيلبي 4: 7)',
      patristicQuote: '«الصلاة الدائمة تنير العقل وتملأ النفس بالرجاء المتجدد.» — القديس مقاريوس الكبير',
      practicalAction: 'خذ دقيقة هدوء الآن، واشكر الله على نعمته وتكريس حياتك لمجده، واسألني عما في قلبك.',
      fullSpeechText:
        'سلام ومحبة من ربنا يسوع المسيح تملأ قلبك. أنا رفيقك الرقمي في مسيرة حسب قلب الله، أرافقك في التأمل ومراجعة مواد الكنيسة والاستعداد لمراحل المسابقة. كيف أساعدك اليوم؟',
      source: 'local-patristic',
    };

    return [
      {
        id: 'msg-welcome',
        sender: 'father',
        text: defaultWelcome.paternalAdvice,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        structured: defaultWelcome,
      },
    ];
  });

  // Stop audio whenever modal closes
  useEffect(() => {
    if (!isOpen) {
      spiritualVoiceService.stopSpeaking();
      spiritualVoiceService.stopListening();
      setIsSpeaking(false);
      setIsListening(false);
      setIsLipSyncOpen(false);
    }
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Speak fatherly message aloud
  const handleSpeakText = (text: string) => {
    if (isMuted) return;

    spiritualVoiceService.speak(text, {
      rate: dialect === 'egyptian' ? 0.9 : 0.85,
      pitch: 0.92,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setIsLipSyncOpen(false);
      },
      onLipSync: (open) => setIsLipSyncOpen(open),
    });
  };

  const handleStopSpeaking = () => {
    spiritualVoiceService.stopSpeaking();
    setIsSpeaking(false);
    setIsLipSyncOpen(false);
  };

  // Toggle voice recognition (Microphone)
  const handleToggleListening = () => {
    if (isListening) {
      spiritualVoiceService.stopListening();
      setIsListening(false);
      return;
    }

    // Stop speaking if currently talking
    spiritualVoiceService.stopSpeaking();
    setIsSpeaking(false);

    const started = spiritualVoiceService.startListening(
      (transcript) => {
        setIsListening(false);
        if (transcript.trim()) {
          handleSendMessage(transcript.trim());
        }
      },
      (listeningState) => setIsListening(listeningState),
      (err) => {
        setIsListening(false);
        console.warn('Voice recognition notice:', err);
      }
    );

    if (!started) {
      setIsListening(false);
    }
  };

  // Send message and get fatherly guidance
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isThinking) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);
    spiritualVoiceService.stopSpeaking();
    setIsSpeaking(false);

    const userVocation: ConsecrationVocation | undefined = currentUser?.vocation;

    try {
      // 1. If online, try server API (using GoogleGenAI gemini-3.8-flash securely)
      let receivedReply: string | null = null;
      let replySource: 'gemini-live' | 'local-patristic' = 'local-patristic';

      if (isOnline) {
        try {
          const res = await fetch('/api/spiritual-guide/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: textToSend.trim(),
              vocation: userVocation,
              dialect,
              conversationHistory: messages.slice(-4).map((m) => ({
                role: m.sender === 'user' ? 'user' : 'model',
                text: m.text,
              })),
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.reply) {
              receivedReply = data.reply;
              replySource = 'gemini-live';
            }
          }
        } catch (fetchErr) {
          console.warn('Online chat route error, falling back to local wisdom:', fetchErr);
        }
      }

      // 2. If no server reply (offline or fallback), query the local patristic knowledge base
      let structuredAnswer: FormattedSpiritualResponse;
      if (receivedReply) {
        // Build response object from Gemini's tailored reply
        structuredAnswer = {
          paternalAdvice: receivedReply,
          biblicalVerse: '',
          patristicQuote: '',
          practicalAction: '',
          fullSpeechText: receivedReply,
          source: 'gemini-live',
        };
      } else {
        // Fallback to offline patristic wisdom
        structuredAnswer = findLocalSpiritualGuidance(textToSend.trim(), userVocation, dialect);
      }

      const fatherMessage: ChatMessage = {
        id: `fth-${Date.now()}`,
        sender: 'father',
        text: structuredAnswer.paternalAdvice,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        structured: structuredAnswer,
      };

      setMessages((prev) => [...prev, fatherMessage]);
      setIsThinking(false);

      // Auto-speak response if not muted
      if (!isMuted) {
        handleSpeakText(structuredAnswer.fullSpeechText || structuredAnswer.paternalAdvice);
      }
    } catch (err) {
      console.warn('Spiritual message dispatch error:', err);
      setIsThinking(false);
      // Emergency fallback
      const emergency = findLocalSpiritualGuidance(textToSend.trim(), userVocation, dialect);
      const fallbackMsg: ChatMessage = {
        id: `fth-${Date.now()}`,
        sender: 'father',
        text: emergency.paternalAdvice,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        structured: emergency,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter prompts for user's vocation
  const filteredPrompts = SPIRITUAL_PROMPT_SUGGESTIONS.filter((p) => {
    if (!p.targetVocations) return true;
    if (!currentUser?.vocation) return true;
    return p.targetVocations.includes(currentUser.vocation);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-right">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl border border-amber-300 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xl shadow-inner">
              🕊️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-spiritual font-black text-lg sm:text-xl text-amber-100">
                  المرشد الروحي الرقمي • أبونا الروحي
                </h2>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2 py-0.5 rounded-full">
                  حسب قلب الله
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                مرافقة في التأمل، والاستعداد لمراحل المسابقة الست، والنمو الروحي والكنسي
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
            title="إغلاق المرشد"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Church Pastoral Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-950 flex items-start sm:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">
              <strong>تنبيه كنسي وأمانة رعوية:</strong> هذا المرشد مساعد رقمي للمراجعة والتأمل في المنصة، وليس بديلاً عن أب الاعتراف الكنسي، ولا يمنح الحِل، ولا يُطلب منك كشف أسرار اعترافك.
            </span>
          </div>
          {!isOnline && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full whitespace-nowrap">
              <WifiOff className="w-3 h-3" />
              وضع أوفلاين محلي
            </span>
          )}
        </div>

        {/* Main Content: Avatar Left/Top + Chat Stream Right/Bottom */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 bg-slate-50/50">
          {/* Avatar & Voice Control Panel (Desktop: 4 cols, Mobile: Top section) */}
          <div className="md:col-span-5 lg:col-span-4 bg-white border-b md:border-b-0 md:border-l border-slate-200 p-4 sm:p-5 flex flex-col items-center justify-between overflow-y-auto">
            <div className="w-full flex flex-col items-center">
              {/* User Vocation Header Tag */}
              {currentUser && (
                <div className="mb-3 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <span>المكرس: {currentUser.name}</span>
                  <span className="text-[10px] bg-amber-200 px-1.5 py-0.2 rounded-full">
                    {currentUser.vocation || 'مشارك'}
                  </span>
                </div>
              )}

              {/* The Reverent Fatherly Avatar */}
              <SpiritualFatherAvatar
                isSpeaking={isSpeaking}
                isListening={isListening}
                isThinking={isThinking}
                isMuted={isMuted}
                isMotionEnabled={isMotionEnabled}
                dialect={dialect}
                isLipSyncOpen={isLipSyncOpen}
                isOnline={isOnline}
                onToggleMute={() => {
                  const nextMute = !isMuted;
                  setIsMuted(nextMute);
                  if (nextMute) handleStopSpeaking();
                }}
                onToggleListening={handleToggleListening}
                onToggleMotion={() => setIsMotionEnabled(!isMotionEnabled)}
                onToggleDialect={() =>
                  setDialect(dialect === 'egyptian' ? 'standard' : 'egyptian')
                }
                activeStatusText={
                  isThinking
                    ? 'يتأمل ويعد النصيحة...'
                    : isSpeaking
                    ? 'يتحدث بالبركة...'
                    : isListening
                    ? 'ينصت لصوتك...'
                    : 'في خدمتك بالمحبة'
                }
                size="md"
              />

              {/* Paternal Motto Card */}
              <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-50/80 to-indigo-50/80 border border-amber-200/80 text-center w-full">
                <p className="text-[11px] font-spiritual font-bold text-amber-950">
                  «تَعَالَ إِلَيَّ بِقَلْبِكَ، فَإِنَّ اللهَ يَنْظُرُ إِلَى الأَمَانَةِ قَبْلَ كُلِّ شَيْءٍ»
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  مرشدك الأمين في رحلة كاهن، ومكرسة، وراهب، وراهبة
                </p>
              </div>
            </div>

            {/* Privacy & Confidentiality Guarantee */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center space-y-1 w-full">
              <p className="flex items-center justify-center gap-1 text-emerald-700 font-bold">
                <span>🔒 خصوصية كاملة</span>
                <span>• لا يتم تخزين تسجيلاتك الصوتية</span>
              </p>
              <p className="text-[10px] text-slate-400">
                يعمل الصوت محلياً عبر متصفحك دون إرسال ملفات صوتية لأي جهة
              </p>
            </div>
          </div>

          {/* Conversation Stream & Input (Desktop: 7-8 cols) */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between h-[520px] sm:h-[580px] bg-slate-50">
            {/* Quick Suggestion Topic Pills */}
            <div className="p-3 bg-white border-b border-slate-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
              <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>موضوعات مقترحة:</span>
              </span>
              {filteredPrompts.slice(0, 5).map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handleSendMessage(prompt.prompt)}
                  disabled={isThinking}
                  className="py-1 px-2.5 rounded-full bg-slate-100 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-slate-800 text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <span>{prompt.icon}</span>
                  <span>{prompt.label}</span>
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  } animate-fade-in`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold text-slate-500">
                    <span>{msg.sender === 'user' ? (currentUser?.name || 'أنت') : 'أبونا الروحي'}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-4 shadow-sm text-right space-y-2 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-tl-sm'
                        : 'bg-white border border-amber-200/90 text-slate-800 rounded-tr-sm shadow-md'
                    }`}
                  >
                    {/* Main text message */}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    {/* Structured additions (Verse, Patristic quote, Practical action) */}
                    {msg.structured && (
                      <div className="pt-2 border-t border-amber-100 space-y-2 text-xs">
                        {/* Scripture Verse Card */}
                        {msg.structured.biblicalVerse && (
                          <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start justify-between gap-2">
                            <div className="flex items-start gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                              <span className="font-spiritual font-bold leading-relaxed">
                                {msg.structured.biblicalVerse}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleCopyText(msg.structured!.biblicalVerse, `v-${msg.id}`)
                              }
                              className="text-amber-700 hover:text-amber-900 p-1 rounded cursor-pointer"
                              title="نسخ الآية"
                            >
                              {copiedId === `v-${msg.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Patristic Quote Card */}
                        {msg.structured.patristicQuote && (
                          <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-950 flex items-start gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-purple-700 flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-semibold">
                              {msg.structured.patristicQuote}
                            </span>
                          </div>
                        )}

                        {/* Practical Step Card */}
                        {msg.structured.practicalAction && (
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>خطوة عملية للمراجعة:</strong>{' '}
                              {msg.structured.practicalAction}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom action icons for father's message */}
                    {msg.sender === 'father' && (
                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleSpeakText(
                                msg.structured?.fullSpeechText || msg.text
                              )
                            }
                            className="p-1 rounded-lg hover:bg-slate-100 text-indigo-900 transition flex items-center gap-1 font-bold cursor-pointer"
                            title="إعادة سماع الصوت"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>استمع</span>
                          </button>

                          <button
                            onClick={() => handleCopyText(msg.text, `t-${msg.id}`)}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition flex items-center gap-1 cursor-pointer"
                            title="نسخ الرد"
                          >
                            {copiedId === `t-${msg.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>نسخ</span>
                          </button>
                        </div>

                        <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {msg.structured?.source === 'gemini-live'
                            ? 'إرشاد رقمي مباشر'
                            : 'حكمة آبائية كنسية'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Thinking Indicator */}
              {isThinking && (
                <div className="flex flex-col items-start animate-fade-in">
                  <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-sm flex items-center gap-2 text-xs text-amber-900 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>أبونا الروحي يصلي ويصيغ لك كلمة المنفعة والبركة...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleToggleListening}
                  disabled={isThinking}
                  className={`p-3 rounded-2xl transition shadow-xs flex-shrink-0 cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                  }`}
                  title={isListening ? 'إيقاف التسجيل الصوتي' : 'تحدث بالصوت'}
                >
                  <Mic className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isListening
                      ? 'جاري الاستماع لصوتك المبارك...'
                      : 'اكتب سؤالك أو تأملك لأبونا الروحي هنا...'
                  }
                  disabled={isThinking}
                  className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 border border-slate-200 focus:bg-white focus:border-amber-400 focus:outline-hidden text-xs sm:text-sm text-slate-800 transition"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isThinking}
                  className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-indigo-900 hover:from-amber-500 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                >
                  <span>إرسال</span>
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
