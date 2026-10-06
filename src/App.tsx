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
} from './utils/competitionEngine';
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

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [activeStageId, setActiveStageId] = useState<number>(1);
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
  }, []);

  const handleUserUpdated = (user: User) => {
    setCurrentUserState(user);
    persistCurrentUser(user);
    setStages(getStoredStages());
  };

  const handleStartStage = (stageId: number) => {
    if (!currentUser) {
      setActiveStageId(stageId);
      setShowRegistrationModal(true);
      return;
    }
    setActiveStageId(stageId);
    setCurrentView('stage_player');
  };

  const handleFinishStage = (nextStageId?: number) => {
    // Refresh user from storage
    const updated = getCurrentUser();
    if (updated) setCurrentUserState(updated);

    if (nextStageId && nextStageId <= 5) {
      setActiveStageId(nextStageId);
      setCurrentView('stage_player');
    } else if (nextStageId === 6) {
      setCurrentView('final_ceremony');
    } else {
      setCurrentView('leaderboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Header
          currentView={currentView}
          currentUser={currentUser}
          onNavigate={(view) => setCurrentView(view)}
          onOpenLogin={() => setShowRegistrationModal(true)}
          onOpenRules={() => setShowRulesModal(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {currentView === 'home' && (
            <HomeView
              currentUser={currentUser}
              stages={stages}
              announcements={announcements}
              onStartStage={handleStartStage}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onOpenMyRank={() => setCurrentView('leaderboard')}
              onOpenRules={() => setShowRulesModal(true)}
              onNavigateToLeaderboard={() => setCurrentView('leaderboard')}
              onNavigateToDioceses={() => setCurrentView('dioceses')}
              onNavigateToSupervisor={() => setCurrentView('supervisor')}
              onNavigateToParticipants={() => setCurrentView('participants')}
              onNavigateToCompetitions={() => setCurrentView('competitions_hub')}
            />
          )}

          {currentView === 'participants' && (
            <ParticipantsListView
              onOpenRegister={() => setShowRegistrationModal(true)}
              onStartStage={handleStartStage}
              onBackToHome={() => setCurrentView('home')}
            />
          )}

          {currentView === 'competitions_hub' && (
            <CompetitionsHubView
              onStartStage={handleStartStage}
              onBackToHome={() => setCurrentView('home')}
            />
          )}

          {currentView === 'stage_player' && currentUser && (
            <StagePlayer
              stageId={activeStageId}
              currentUser={currentUser}
              onFinishStage={handleFinishStage}
              onBackToHome={() => setCurrentView('home')}
              onOpenLeaderboard={() => setCurrentView('leaderboard')}
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
                setActiveStageId(stgId);
                setCurrentView('stage_player');
              }}
            />
          )}

          {currentView === 'final_ceremony' && (
            <FinalCeremonyView
              onBackToHome={() => setCurrentView('home')}
              onOpenLeaderboard={() => setCurrentView('leaderboard')}
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

      {/* Minimal Reverent Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p className="font-spiritual font-bold text-slate-700">
            مسابقة «المكرَّسة المثالية» • منصة التميز المعرفي والروحي والكنسي
          </p>
          <p className="text-[11px] text-slate-400">
            «كُنْ أَمِيناً إِلَى الْمَوْتِ فَسَأُعْطِيكَ إِكْلِيلَ الْحَيَاةِ» (رؤيا 2: 10)
          </p>
        </div>
      </footer>
    </div>
  );
}
