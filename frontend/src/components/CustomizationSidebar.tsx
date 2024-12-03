import React, { useState, useEffect } from 'react';
import './styles/CustomizationSidebar.css';

interface CustomizationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomizationSidebar: React.FC<CustomizationSidebarProps> = ({ isOpen, onClose }) => {
  const [accentColor, setAccentColor] = useState('#6366f1');

  useEffect(() => {
    // Load saved color from localStorage
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
      setAccentColor(savedColor);
      document.documentElement.style.setProperty('--accent-color', savedColor);
    }
  }, []);

  const handleColorChange = (color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
  };

  const predefinedColors = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#8b5cf6', // Purple
    '#22c55e', // Green
  ];

  return (
    <div className={`customization-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Customize Theme</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="sidebar-content">
        <div className="color-section">
          <h3>Accent Color</h3>
          <div className="color-picker">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="color-input"
            />
            <span className="current-color">Current: {accentColor}</span>
          </div>
          
          <div className="preset-colors">
            <h4>Preset Colors</h4>
            <div className="color-grid">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  className="color-preset"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationSidebar;
