'use client';
import { useState } from 'react';
import CoachClient from './CoachClient';
import CoachesPanel from './CoachesPanel';

export default function CoachWrapper({ chats, userId, profile }) {
  const [tab, setTab] = useState('coaches');

  return (
    <div className="coach-wrap">
      <div className="coach-segctrl" role="tablist" aria-label="Coach-Bereich wechseln">
        <button
          role="tab"
          aria-selected={tab === 'chat'}
          className={`coach-seg ${tab === 'chat' ? 'on' : ''}`}
          onClick={() => setTab('chat')}
          type="button"
        >
          <span className="coach-seg-dot" /> KI-Coach
        </button>
        <button
          role="tab"
          aria-selected={tab === 'coaches'}
          className={`coach-seg ${tab === 'coaches' ? 'on' : ''}`}
          onClick={() => setTab('coaches')}
          type="button"
        >
          Live-Coaches
        </button>
      </div>

      <div className="coach-tabpanel" role="tabpanel">
        {tab === 'chat' && <CoachClient chats={chats} userId={userId} profile={profile} />}
        {tab === 'coaches' && <CoachesPanel />}
      </div>
    </div>
  );
}
