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
      setClosedStageToast(`تنبيه: مرحلة «${targetStage.title}» مغلقة حالياً بتوجيه المشرفة.`);
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
