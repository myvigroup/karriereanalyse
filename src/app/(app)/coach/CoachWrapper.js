'use client';
import { useState } from 'react';
import CoachClient from './CoachClient';
import CoachesPanel from './CoachesPanel';

export default function CoachWrapper({ chats, userId, profile }) {
  const [tab, setTab] = useState('chat');

  return (
    <div className="coach-wrap">
      <div className="coach-tabs" role="tablist" aria-label="Coach-Bereich wechseln">
        <button
          role="tab"
          aria-selected={tab === 'chat'}
          className={`coach-tab ${tab === 'chat' ? 'on' : ''}`}
          onClick={() => setTab('chat')}
        >
          KI-Coach
          <span className="coach-tab-sub">24/7 verfügbar</span>
        </button>
        <button
          role="tab"
          aria-selected={tab === 'coaches'}
          className={`coach-tab ${tab === 'coaches' ? 'on' : ''}`}
          onClick={() => setTab('coaches')}
        >
          Unsere Live-Coaches
          <span className="coach-tab-sub">echte Menschen · Seminare & 1:1</span>
        </button>
      </div>

      <div className="coach-tabpanel" role="tabpanel">
        {tab === 'chat' && <CoachClient chats={chats} userId={userId} profile={profile} />}
        {tab === 'coaches' && <CoachesPanel />}
      </div>
    </div>
  );
}
