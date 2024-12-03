import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './styles/CustomizationSidebar.css';

interface CustomizationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomizationSidebar: React.FC<CustomizationSidebarProps> = ({ isOpen, onClose }) => {
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPreferences();
    }
  }, [isAuthenticated]);

  const fetchPreferences = async () => {
    try {
      setError(null);
      const response = await api.get('/preferences');
      if (response.data.accentColor) {
        setAccentColor(response.data.accentColor);
        updateDocumentColors(response.data.accentColor);
      }
    } catch (error: any) {
      console.error('Error fetching preferences:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load preferences';
      setError(errorMessage);
      // Set default color if there's an error
      updateDocumentColors('#6366f1');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = async (color: string) => {
    try {
      setError(null);
      setAccentColor(color);
      updateDocumentColors(color);
      await api.put('/preferences', { accentColor: color });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save preferences';
      setError(errorMessage);
    }
  };

  const updateDocumentColors = (color: string) => {
    document.documentElement.style.setProperty('--accent-color', color);
    const hoverColor = adjustColorBrightness(color, -10);
    document.documentElement.style.setProperty('--accent-hover', hoverColor);
  };

  const adjustColorBrightness = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  };

  const predefinedColors = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#8b5cf6', // Purple
    '#22c55e', // Green
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`customization-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Customize Theme</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="sidebar-content">
        {loading ? (
          <div className="loading">Loading preferences...</div>
        ) : (
          <div>
            <div className="color-picker-section">
              <label htmlFor="accentColor">Accent Color</label>
              <input
                type="color"
                id="accentColor"
                value={accentColor}
                onChange={(e) => handleColorChange(e.target.value)}
              />
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
        )}
      </div>
    </div>
  );
};

export default CustomizationSidebar;
