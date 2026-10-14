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
import { SpiritualLifeView } from './components/SpiritualLifeView';
import { BiblicalStudyView } from './components/BiblicalStudyView';
import { PersonalSpaceView } from './components/PersonalSpaceView';
import { LibraryView } from './components/LibraryView';
import { WorkshopsView } from './components/WorkshopsView';
import { CreativeLab } from './components/CreativeLab';
import { StudyToolsView } from './components/StudyToolsView';
import { MonasticOasis } from './components/MonasticOasis';
import { SpiritualGamesHub } from './components/SpiritualGamesHub';
import { ReadingThemeProvider, useReadingTheme } from './context/ReadingThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ReadingSettingsModal } from './components/ReadingSettingsModal';
import { EmergencyRescueModal } from './components/EmergencyRescueModal';

function AppContent() {
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
  const [showReadingSettingsModal, setShowReadingSettingsModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [emergencyInitialSituation, setEmergencyInitialSituation] = useState<
    'distress' | 'boredom' | 'lukewarmness' | 'anger'
  >('distress');

  const handleOpenEmergency = (
    situation: 'distress' | 'boredom' | 'lukewarmness' | 'anger' = 'distress'
  ) => {
    setEmergencyInitialSituation(situation);
    setShowEmergencyModal(true);
  };

  const { isNightMode, getContainerClass } = useReadingTheme();
  const { language, t } = useLanguage();

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

    if (nextStageId && nextStageId <= 6) {
      handleSetActiveStage(nextStageId);
      handleNavigate('stage_player');
    } else if (nextStageId === 7 || nextStageId === undefined) {
      handleNavigate('final_ceremony');
    } else {
      handleNavigate('leaderboard');
    }
  };

  return (
    <div className={`min-h-screen ${getContainerClass()} font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col justify-between`}>
      <div>
        {/* Navigation Header */}
        <Header
          currentView={currentView}
          currentUser={currentUser}
          onNavigate={(view) => handleNavigate(view)}
          onOpenLogin={() => setShowRegistrationModal(true)}
          onOpenRules={() => setShowRulesModal(true)}
          onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
          onOpenReadingSettings={() => setShowReadingSettingsModal(true)}
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
              onNavigateToSpiritualLife={() => handleNavigate('spiritual_life')}
              onNavigateToBiblicalStudy={() => handleNavigate('biblical_study')}
              onNavigateToPersonalSpace={() => handleNavigate('personal_space')}
              onOpenReadingSettings={() => setShowReadingSettingsModal(true)}
              onNavigateToLibrary={() => handleNavigate('library')}
              onNavigateToWorkshops={() => handleNavigate('workshops')}
              onNavigateToCreativeLab={() => handleNavigate('creative_lab')}
              onNavigateToStudyTools={() => handleNavigate('study_tools')}
              onNavigateToMonasticOasis={() => handleNavigate('monastic_oasis')}
              onOpenEmergencyModal={handleOpenEmergency}
              onNavigateToSpiritualGames={() => handleNavigate('spiritual_games')}
            />
          )}

          {currentView === 'library' && (
            <LibraryView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'workshops' && (
            <WorkshopsView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'creative_lab' && (
            <CreativeLab
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'study_tools' && (
            <StudyToolsView
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'monastic_oasis' && (
            <MonasticOasis
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'spiritual_games' && (
            <SpiritualGamesHub
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'spiritual_life' && (
            <SpiritualLifeView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'biblical_study' && (
            <BiblicalStudyView
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'personal_space' && (
            <PersonalSpaceView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onBackToHome={() => handleNavigate('home')}
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
              key={`stage-${activeStageId}`}
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

      {/* Reading & Night Mode Settings Modal */}
      <ReadingSettingsModal
        isOpen={showReadingSettingsModal}
        onClose={() => setShowReadingSettingsModal(false)}
      />

      {/* Emergency Rescue Modal */}
      <EmergencyRescueModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        initialSituation={emergencyInitialSituation}
      />

      {/* Floating Emergency Rescue Quick Access Button */}
      <button
        onClick={() => handleOpenEmergency('distress')}
        className="fixed bottom-20 left-6 z-40 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-2xl shadow-rose-600/40 border-2 border-white flex items-center gap-2 hover:scale-105 active:scale-95 transition cursor-pointer"
        title="خطط الإنقاذ السريعة وقت الضيق والفتور"
      >
        <span className="text-lg">🚨</span>
        <span className="hidden sm:inline text-xs font-bold">خطط الطوارئ والإنقاذ</span>
      </button>

      {/* Floating Spiritual Father Quick Access Button */}
      <button
        onClick={() => setShowSpiritualGuideModal(true)}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-indigo-950 font-black p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-2xl shadow-amber-600/40 border-2 border-white flex items-center gap-2.5 hover:scale-105 active:scale-95 transition cursor-pointer group"
        title="استشارة أبونا الروحي والمرشد"
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
          <span className="block text-[10px] text-amber-950/80 font-normal">رفيق التأمل والنمو</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-white" />
      </button>

      {/* Floating Spiritual Games Quick Access Button */}
      {currentView !== 'spiritual_games' && (
        <button
          onClick={() => handleNavigate('spiritual_games')}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-indigo-950 font-black p-3 sm:px-5 sm:py-3 rounded-full shadow-2xl shadow-amber-600/50 border-2 border-white flex items-center gap-2 hover:scale-105 active:scale-95 transition cursor-pointer animate-bounce-subtle"
          title="الألعاب الترفيهية الروحية"
        >
          <span className="text-xl">🎮</span>
          <span className="font-spiritual font-black text-xs sm:text-sm">الألعاب الترفيهية الروحية</span>
          <span className="bg-indigo-950 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
            جديد ✨
          </span>
        </button>
      )}

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />

      {/* Minimal Reverent Footer */}
      <footer
        className={`border-t py-6 text-center text-xs transition-colors duration-200 ${
          isNightMode
            ? 'border-[#383229] bg-[#181614]/80 text-[#9e9587]'
            : 'border-slate-200 bg-white/60 text-slate-500'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p
            className={`font-spiritual font-bold ${
              isNightMode ? 'text-amber-200/90' : 'text-slate-700'
            }`}
          >
            منصة «حَسَبَ قَلْبِ اللهِ» (كاهن – مكرَّسة – راهب – راهبة) • مسيرة المراجعة والنمو الروحي والكنسي
          </p>
          <p className={`text-[11px] ${isNightMode ? 'text-[#8c8273]' : 'text-slate-400'}`}>
            «كُنْ أَمِيناً إِلَى الْمَوْتِ فَسَأُعْطِيكَ إِكْلِيلَ الْحَيَاةِ» (رؤيا 2: 10)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ReadingThemeProvider>
        <AppContent />
      </ReadingThemeProvider>
    </LanguageProvider>
  );
}
