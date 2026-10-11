/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, AppView, Stage, Announcement } from './types';
import {
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
  getStoredStages,
  getStoredAnnouncements,
  saveStages,
  saveAnnouncements,
} from './utils/competitionEngine';
import {
  seedCloudDatabaseIfEmpty,
  subscribeToCloudStages,
  subscribeToCloudAnnouncements,
  syncUserToCloud,
} from './utils/firebaseService';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { StagePlayer } from './components/StagePlayer';
import { LeaderboardView } from './components/LeaderboardView';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { FinalCeremonyView } from './components/FinalCeremonyView';
import { ParticipantsListView } from './components/ParticipantsListView';
import { CompetitionsHubView } from './components/CompetitionsHubView';
import { RegistrationModal } from './components/RegistrationModal';
import { RulesModal } from './components/RulesModal';
import { SpiritualGuideModal } from './components/SpiritualGuideModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mokarasa_current_view') as AppView;
      if (saved) return saved;
    }
    return 'home';
  });
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [activeStageId, setActiveStageId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mokarasa_active_stage_id');
      if (saved) return parseInt(saved) || 1;
    }
    return 1;
  });
  const [stages, setStages] = useState<Stage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Modals
  const [showRegistrationModal, setShowRegistrationModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showSpiritualGuideModal, setShowSpiritualGuideModal] = useState<boolean>(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUserState(user);
    setStages(getStoredStages());
    setAnnouncements(getStoredAnnouncements());

    // 1. Seed cloud database if not already seeded
    seedCloudDatabaseIfEmpty().catch((err) => console.warn('Cloud seed error:', err));

    // 2. Real-time subscription to cloud stages
    const unsubStages = subscribeToCloudStages((cloudStages) => {
      if (cloudStages && cloudStages.length > 0) {
        setStages(cloudStages);
        saveStages(cloudStages);
      }
    });

    // 3. Real-time subscription to cloud announcements
    const unsubAnnouncements = subscribeToCloudAnnouncements((cloudAnn) => {
      if (cloudAnn && cloudAnn.length > 0) {
        setAnnouncements(cloudAnn);
        saveAnnouncements(cloudAnn);
      }
    });

    return () => {
      unsubStages();
      unsubAnnouncements();
    };
  }, []);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mokarasa_current_view', view);
    }
  };

  const handleSetActiveStage = (stageId: number) => {
    setActiveStageId(stageId);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mokarasa_active_stage_id', String(stageId));
    }
  };

  const handleUserUpdated = (user: User) => {
    setCurrentUserState(user);
    persistCurrentUser(user);
    setStages(getStoredStages());
    syncUserToCloud(user).catch((err) => console.warn('User cloud sync error:', err));
  };

  const [closedStageToast, setClosedStageToast] = useState<string | null>(null);

  const handleStartStage = (stageId: number) => {
    const targetStage = stages.find((s) => s.id === stageId);
    if (targetStage && targetStage.isOpen === false) {
      setClosedStageToast(`تنبيه: مرحلة «${targetStage.title}» مغلقة حالياً بتوجيه إدارة المسابقة.`);
      setTimeout(() => setClosedStageToast(null), 4000);
      return;
    }
    if (!currentUser) {
      handleSetActiveStage(stageId);
      setShowRegistrationModal(true);
      return;
    }
    handleSetActiveStage(stageId);
    handleNavigate('stage_player');
  };

  const handleFinishStage = (nextStageId?: number) => {
    // Refresh user from storage
    const updated = getCurrentUser();
    if (updated) setCurrentUserState(updated);

    if (nextStageId && nextStageId <= 5) {
      handleSetActiveStage(nextStageId);
      handleNavigate('stage_player');
    } else if (nextStageId === 6) {
      handleNavigate('final_ceremony');
    } else {
      handleNavigate('leaderboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Header
          currentView={currentView}
          currentUser={currentUser}
          onNavigate={(view) => handleNavigate(view)}
          onOpenLogin={() => setShowRegistrationModal(true)}
          onOpenRules={() => setShowRulesModal(true)}
          onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
        />

        {/* Toast for closed stages */}
        {closedStageToast && (
          <div className="max-w-2xl mx-auto px-4 pt-3 animate-fade-in text-right">
            <div className="bg-rose-50 border-2 border-rose-300 text-rose-800 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold">{closedStageToast}</span>
              <button
                onClick={() => setClosedStageToast(null)}
                className="text-xs text-rose-600 hover:text-rose-900 font-bold px-2 py-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {currentView === 'home' && (
            <HomeView
              currentUser={currentUser}
              stages={stages}
              announcements={announcements}
              onStartStage={handleStartStage}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onOpenMyRank={() => handleNavigate('leaderboard')}
              onOpenRules={() => setShowRulesModal(true)}
              onNavigateToLeaderboard={() => handleNavigate('leaderboard')}
              onNavigateToDioceses={() => handleNavigate('dioceses')}
              onNavigateToSupervisor={() => handleNavigate('supervisor')}
              onNavigateToParticipants={() => handleNavigate('participants')}
              onNavigateToCompetitions={() => handleNavigate('competitions_hub')}
              onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
            />
          )}

          {currentView === 'participants' && (
            <ParticipantsListView
              onOpenRegister={() => setShowRegistrationModal(true)}
              onStartStage={handleStartStage}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'competitions_hub' && (
            <CompetitionsHubView
              onStartStage={handleStartStage}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'stage_player' && currentUser && (
            <StagePlayer
              stageId={activeStageId}
              currentUser={currentUser}
              onFinishStage={handleFinishStage}
              onBackToHome={() => handleNavigate('home')}
              onOpenLeaderboard={() => handleNavigate('leaderboard')}
            />
          )}

          {currentView === 'leaderboard' && (
            <LeaderboardView
              currentUser={currentUser}
              onOpenRegister={() => setShowRegistrationModal(true)}
              onStartStage={handleStartStage}
            />
          )}

          {currentView === 'dioceses' && (
            <LeaderboardView
              currentUser={currentUser}
              onOpenRegister={() => setShowRegistrationModal(true)}
              onStartStage={handleStartStage}
            />
          )}

          {currentView === 'supervisor' && (
            <SupervisorDashboard
              onTestStageAsAdmin={(stgId) => {
                handleSetActiveStage(stgId);
                handleNavigate('stage_player');
              }}
            />
          )}

          {currentView === 'final_ceremony' && (
            <FinalCeremonyView
              onBackToHome={() => handleNavigate('home')}
              onOpenLeaderboard={() => handleNavigate('leaderboard')}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={handleUserUpdated}
      />

      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />

      {/* Spiritual Father Guide Modal */}
      <SpiritualGuideModal
        isOpen={showSpiritualGuideModal}
        onClose={() => setShowSpiritualGuideModal(false)}
        currentUser={currentUser}
      />

      {/* Floating Spiritual Father Quick Access Button */}
      <button
        onClick={() => setShowSpiritualGuideModal(true)}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-indigo-950 font-black p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-2xl shadow-amber-600/40 border-2 border-white flex items-center gap-2.5 hover:scale-105 active:scale-95 transition cursor-pointer group"
        title="استشارة أبونا الروحي (المرشد الرقمي)"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-950 border border-amber-200 flex-shrink-0">
          <img
            src="/src/assets/images/spiritual_father_avatar_1791703349048.jpg"
            alt="أبونا الروحي"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="hidden sm:block text-right">
          <span className="block text-xs font-bold leading-tight">أبونا الروحي</span>
          <span className="block text-[10px] text-amber-950/80 font-normal">المرشد الرقمي</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-white" />
      </button>

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />

      {/* Minimal Reverent Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-spiritual font-bold text-slate-700">
            منصة «حَسَبَ قَلْبِ اللهِ» (كاهن – مكرَّسة – راهب – راهبة) • مسيرة المراجعة والنمو الروحي والكنسي
          </p>
          <p className="text-[11px] text-slate-400">
            «كُنْ أَمِيناً إِلَى الْمَوْتِ فَسَأُعْطِيكَ إِكْلِيلَ الْحَيَاةِ» (رؤيا 2: 10)
          </p>
        </div>
      </footer>
    </div>
  );
}
