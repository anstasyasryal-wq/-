/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Question, QuizMode, SoloQuizResult } from './types';
import { 
  getStoredQuestions, 
  saveCustomQuestion, 
  getLeaderboardResults 
} from './utils/storage';
import { soundManager } from './utils/audio';

import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { SoloQuiz } from './components/SoloQuiz';
import { TeamQuiz } from './components/TeamQuiz';
import { SpeedChallenge } from './components/SpeedChallenge';
import { StudyBank } from './components/StudyBank';
import { Leaderboard } from './components/Leaderboard';
import { CertificateModal } from './components/CertificateModal';
import { CustomQuestionModal } from './components/CustomQuestionModal';
import { MonasticOasis } from './components/MonasticOasis';
import { CreativeLab } from './components/CreativeLab';
import { WiseVirginsModal } from './components/WiseVirginsModal';

export default function App() {
  const [currentMode, setCurrentMode] = useState<QuizMode>('home');
  const [questionsPool, setQuestionsPool] = useState<Question[]>([]);
  const [leaderboardResults, setLeaderboardResults] = useState<SoloQuizResult[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedCertificateResult, setSelectedCertificateResult] = useState<SoloQuizResult | null>(null);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);
  const [showWiseVirginsModal, setShowWiseVirginsModal] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    setQuestionsPool(getStoredQuestions());
    setLeaderboardResults(getLeaderboardResults());
    setIsMuted(soundManager.getIsMuted());
  }, []);

  const handleToggleMute = () => {
    const newState = soundManager.toggleMute();
    setIsMuted(newState);
  };

  const handleSaveQuestion = (newQ: Omit<Question, 'id' | 'isCustom'>) => {
    const saved = saveCustomQuestion(newQ);
    setQuestionsPool((prev) => [saved, ...prev]);
  };

  const handleImportQuestions = (imported: Question[]) => {
    setQuestionsPool((prev) => [...imported, ...prev]);
  };

  const handleOpenCertificate = (result: SoloQuizResult) => {
    setSelectedCertificateResult(result);
  };

  const handleClearHistory = () => {
    if (window.confirm('هل أنتِ متأكدة من رغبتكِ في مسح سجل لوحة الشرف؟')) {
      localStorage.removeItem('mokarasa_leaderboard_history');
      setLeaderboardResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/25 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Universal Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAddQuestion={() => setShowAddQuestionModal(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentMode === 'home' && (
          <HomeDashboard
            onSelectMode={(mode) => {
              setCurrentMode(mode);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenWiseVirginsIcon={() => setShowWiseVirginsModal(true)}
            totalQuestionsCount={questionsPool.length}
            totalCompletedCount={leaderboardResults.length}
          />
        )}

        {currentMode === 'solo' && (
          <SoloQuiz
            questionsPool={questionsPool}
            onOpenCertificate={handleOpenCertificate}
            onBackToHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'team' && (
          <TeamQuiz
            questionsPool={questionsPool}
            onBackToHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'oasis' && (
          <MonasticOasis
            onBackToHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'creative' && (
          <CreativeLab
            onBackToHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'speed' && (
          <SpeedChallenge
            questionsPool={questionsPool}
            onBackToHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'study' && (
          <StudyBank
            questions={questionsPool}
            onBackToHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'leaderboard' && (
          <Leaderboard
            results={leaderboardResults}
            onOpenCertificate={handleOpenCertificate}
            onClearHistory={handleClearHistory}
            onBackToHome={() => setCurrentMode('home')}
          />
        )}
      </main>

      {/* Printable Certificate Modal */}
      {selectedCertificateResult && (
        <CertificateModal
          result={selectedCertificateResult}
          onClose={() => setSelectedCertificateResult(null)}
        />
      )}

      {/* Wise Virgins Coptic Icon Modal */}
      {showWiseVirginsModal && (
        <WiseVirginsModal
          onClose={() => setShowWiseVirginsModal(false)}
        />
      )}

      {/* Custom Questions & Import/Export Modal */}
      {showAddQuestionModal && (
        <CustomQuestionModal
          onClose={() => setShowAddQuestionModal(false)}
          onSaveQuestion={handleSaveQuestion}
          allQuestions={questionsPool}
          onImportQuestions={handleImportQuestions}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 border-t border-amber-900/40 text-xs text-center font-sans">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-spiritual text-stone-300 text-base">
            مسابقة المكرسة المثالية | «فَاخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ الَّذِي لَنْ يُنْزَعَ مِنْهَا»
          </p>
          <p>
            معدة ومخصصة لخدمة بيوت التكريس، الشمامسة، والخدام في الكنيسة القبطية الأرثوذكسية
          </p>
          <p className="text-stone-500 text-[11px] pt-1">
            العلوم الدينية واللاهوتية · سير وفضائل آباء وأمهات الرهبنة · اللغة القبطية والتراث الكنسي
          </p>
        </div>
      </footer>

    </div>
  );
}
