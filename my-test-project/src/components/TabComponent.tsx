import React, { useState, useRef, useEffect } from 'react';
import EventsTab from "./EventsTab";
import { ReactComponent as ArrowIcon } from '../images/glyphicon-chevron-down-e259.svg';
import './components.css';

const TabComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [eventTab, setEventTab] = useState('Всі');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleEventTabClick = (option: string) => {
    setEventTab(option);
    setDropdownOpen(false);
  };

  const eventOptions = ['Всі', 'Коментарі'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="tabContainer">
        <button className={`tab ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>Резюме</button>
        <div className={`tab ${activeTab === 'events' ? 'active' : ''}`}>
          <button onClick={() => setActiveTab('events')} style={{cursor: activeTab === 'events' ? 'default' : 'pointer'}}>Події</button>
          <div ref={dropdownRef}>
          <button 
              className="dropdown-button"
              onClick={() => { 
                if (activeTab === 'events') { 
                  setDropdownOpen(!isDropdownOpen) 
                } else {
                  setActiveTab('events');
                } 
              }}
            >
              {eventTab} <ArrowIcon />
            </button>

            {isDropdownOpen && (
              <ul className="dropdown-content show">
                {eventOptions.map((option, index) => 
                  <li key={index} onClick={() => handleEventTabClick(option)}>{option}</li>
                )}
              </ul>
            )}
          </div>
        </div>
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
