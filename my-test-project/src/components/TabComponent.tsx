import React, { useState } from 'react';
import EventsTab from "./EventsTab";
import './components.css';

const TabComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resume');

  return (
    <div>
      <div className="tabContainer">
        <button className={`tab ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>Резюме</button>
        <button className={`tab ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>Події</button>
        <button className={`tab ${activeTab === 'ongoing' ? 'active' : ''}`} onClick={() => setActiveTab('ongoing')}>Ще проходить</button>
      </div>
      <div>
        {activeTab === 'events' ? <EventsTab /> : null}
        {/* Додайте контент для інших вкладок, якщо необхідно */}
      </div>
    </div>
  );
};

export default TabComponent;