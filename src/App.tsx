import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');

  return (
    <div className="min-h-screen bg-white">
      {currentView === 'landing' && (
        <LandingPage onStartChat={() => setCurrentView('chat')} />
      )}
      {currentView === 'chat' && (
        <ChatInterface onBackToLanding={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

export default App;