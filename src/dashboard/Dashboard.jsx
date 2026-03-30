import React, { useEffect, useState } from 'react';
import { Sparkles, Trash2, RefreshCw, AlertCircle, LogIn } from 'lucide-react';
import useTabStore from '../store/tabStore';
import useAuthStore from '../store/authStore';
import { isSupabaseConfigured } from '../utils/supabase';
import { fullSync } from '../utils/syncService';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import StatsCards from './components/StatsCards';
import TabCard from './components/TabCard';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AuthPage from './components/AuthPage';
import UserMenu from './components/UserMenu';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

export default function Dashboard() {
  const { tabs, loading: tabsLoading, init, getFilteredTabs, deleteAllData, searchQuery } = useTabStore();
  const { isAuthenticated, user, loading: authLoading, restoreSession } = useAuthStore();
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const filteredTabs = getFilteredTabs();

  useEffect(() => {
    const bootstrap = async () => {
      // Restore auth session first
      if (isSupabaseConfigured()) {
        await restoreSession();
      }
      // Then load tab data
      await init();
    };
    bootstrap();
  }, []);

  // After successful login, run initial sync
  useEffect(() => {
    if (isAuthenticated && user) {
      fullSync(user.id).then(() => init());
      setShowAuth(false);
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    if (isAuthenticated && user) {
      await fullSync(user.id);
    }
    await init();
  };

  const loading = tabsLoading || authLoading;

  // Show auth page if requested
  if (showAuth && !isAuthenticated) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowAuth(false)}
          className="absolute top-6 right-6 z-10 btn-ghost text-sm"
        >
          ← Back to Dashboard
        </button>
        <AuthPage />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center animate-pulse-soft">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan 
                        flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
            <Sparkles size={28} className="text-white" />
          </div>
          <p className="text-surface-400 text-sm">Loading MindTabs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent-violet/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan 
                          flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">MindTabs</h1>
              <p className="text-xs text-surface-400">Your intelligent tab manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" icon={RefreshCw} size="sm" onClick={handleRefresh}>
              Refresh
            </Button>
            {tabs.length > 0 && (
              <Button 
                variant="danger" 
                icon={Trash2} 
                size="sm"
                onClick={() => setShowDeleteAll(true)}
              >
                Clear All
              </Button>
            )}

            {/* Auth: UserMenu or Sign In button */}
            {isAuthenticated ? (
              <UserMenu />
            ) : isSupabaseConfigured() ? (
              <Button variant="secondary" icon={LogIn} size="sm" onClick={() => setShowAuth(true)}>
                Sign In
              </Button>
            ) : null}
          </div>
        </header>

        {/* Stats */}
        <div className="mb-6">
          <StatsCards />
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar />

          {/* Tab List */}
          <div className="flex-1 min-w-0">
            {filteredTabs.length === 0 ? (
              searchQuery ? (
                <EmptyState 
                  title="No matching tabs"
                  description={`No tabs found for "${searchQuery}". Try a different search term.`}
                  icon={AlertCircle}
                />
              ) : (
                <EmptyState />
              )
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-surface-400">
                    Showing <span className="text-surface-200 font-medium">{filteredTabs.length}</span> tab{filteredTabs.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="space-y-3">
                  {filteredTabs.map((tab, index) => (
                    <TabCard key={tab.id} tab={tab} index={index} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete All Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteAll}
        onClose={() => setShowDeleteAll(false)}
        onConfirm={() => {
          deleteAllData();
          setShowDeleteAll(false);
        }}
        title="Delete All Data"
        message="This will permanently delete all tracked tabs, tags, and reminders. This action cannot be undone."
      />
    </div>
  );
}
