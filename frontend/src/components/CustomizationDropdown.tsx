import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './styles/CustomizationDropdown.css';

interface CustomizationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

interface Preferences {
  accentColor: string;
  presets: string[];
}

const STORAGE_KEY = 'user_preferences';
const DEFAULT_COLOR = '#6366f1';

const CustomizationDropdown: React.FC<CustomizationDropdownProps> = ({ isOpen, onClose, anchorRef }) => {
  const [accentColor, setAccentColor] = useState(DEFAULT_COLOR);
  const [presets, setPresets] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateDocumentColors = useCallback((color: string) => {
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.style.setProperty('--accent-color-hover', `${color}dd`);
    document.documentElement.style.setProperty('--accent-color-light', `${color}33`);
    document.documentElement.style.setProperty('--accent-color-10', `${color}1a`);
    document.documentElement.style.setProperty('--button-text-color', '#ffffff');

    // Calculate contrast color for text
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    if (brightness > 128) {
      document.documentElement.style.setProperty('--button-text-color', '#1f2937');
    }
  }, []);

  const loadLocalPreferences = useCallback((): Preferences | null => {
    if (!user?.id) return null;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const prefs = JSON.parse(stored) as Record<string, Preferences>;
        return prefs[user.id] || null;
      } catch (e) {
        console.error('Error parsing stored preferences:', e);
      }
    }
    return null;
  }, [user?.id]);

  const saveLocalPreferences = useCallback((prefs: Preferences) => {
    if (!user?.id) return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allPrefs: Record<string, Preferences> = stored ? JSON.parse(stored) : {};
      allPrefs[user.id] = prefs;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allPrefs));
    } catch (e) {
      console.error('Error saving preferences to localStorage:', e);
    }
  }, [user?.id]);

  const fetchPreferences = useCallback(async () => {
    try {
      setError(null);
      // First try to load from localStorage
      const localPrefs = loadLocalPreferences();
      if (localPrefs) {
        setAccentColor(localPrefs.accentColor);
        setPresets(localPrefs.presets);
        updateDocumentColors(localPrefs.accentColor);
      }

      // Then fetch from API
      const response = await api.get('/preferences');
      const apiPrefs = {
        accentColor: response.data.accentColor || DEFAULT_COLOR,
        presets: response.data.presets || []
      };
      
      setAccentColor(apiPrefs.accentColor);
      setPresets(apiPrefs.presets);
      updateDocumentColors(apiPrefs.accentColor);
      saveLocalPreferences(apiPrefs);
    } catch (error: any) {
      console.error('Error fetching preferences:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load preferences';
      setError(errorMessage);
      
      // If API fails, keep using localStorage data if available
      const localPrefs = loadLocalPreferences();
      if (!localPrefs) {
        updateDocumentColors(DEFAULT_COLOR);
      }
    }
  }, [loadLocalPreferences, saveLocalPreferences, updateDocumentColors]);

  const handleColorChange = useCallback(async (color: string) => {
    try {
      setError(null);
      setAccentColor(color);
      updateDocumentColors(color);

      const newPrefs = { accentColor: color, presets };
      saveLocalPreferences(newPrefs);

      await api.put('/preferences', newPrefs);
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save preferences';
      setError(errorMessage);
    }
  }, [presets, saveLocalPreferences, updateDocumentColors]);

  const handleSavePreset = useCallback(async () => {
    try {
      setError(null);
      if (presets.includes(accentColor)) {
        setError('This color is already saved as a preset');
        return;
      }
      const newPresets = [...presets, accentColor];
      setPresets(newPresets);

      const newPrefs = { accentColor, presets: newPresets };
      saveLocalPreferences(newPrefs);

      await api.put('/preferences', newPrefs);
    } catch (error: any) {
      console.error('Error saving preset:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save preset';
      setError(errorMessage);
    }
  }, [accentColor, presets, saveLocalPreferences]);

  const handleRemovePreset = useCallback(async (colorToRemove: string) => {
    try {
      setError(null);
      const newPresets = presets.filter(color => color !== colorToRemove);
      setPresets(newPresets);

      const newPrefs = { accentColor, presets: newPresets };
      saveLocalPreferences(newPrefs);

      await api.put('/preferences', newPrefs);
    } catch (error: any) {
      console.error('Error removing preset:', error);
      const errorMessage = error.response?.data?.error || 'Failed to remove preset';
      setError(errorMessage);
    }
  }, [accentColor, presets, saveLocalPreferences]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchPreferences();
    }
  }, [isAuthenticated, user?.id, fetchPreferences]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  const predefinedColors = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#8b5cf6', // Purple
    '#22c55e', // Green
  ];

  if (!isAuthenticated || !isOpen) {
    return null;
  }

  return (
    <div 
      className="customization-dropdown"
      ref={dropdownRef}
      style={{
        top: anchorRef.current ? anchorRef.current.getBoundingClientRect().bottom + 8 : 0,
        right: '1.5rem',
      }}
    >
      <div className="dropdown-content">
        <h3>Theme Colors</h3>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="color-options">
          {predefinedColors.map((color) => (
            <button
              key={color}
              className={`color-option ${color === accentColor ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              aria-label={`Select ${color} theme color`}
            />
          ))}
        </div>

        {presets.length > 0 && (
          <div className="presets-section">
            <h4>Your Presets</h4>
            <div className="color-options">
              {presets.map((color) => (
                <div key={color} className="preset-color-container">
                  <button
                    className={`color-option ${color === accentColor ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    aria-label={`Select preset color ${color}`}
                  />
                  <button
                    className="remove-preset"
                    onClick={() => handleRemovePreset(color)}
                    aria-label={`Remove preset color ${color}`}
                  >
                    −
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="custom-color-section">
          <label htmlFor="custom-color">Custom Color</label>
          <div className="custom-color-input">
            <input
              type="color"
              id="custom-color"
              value={accentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              aria-label="Pick custom theme color"
            />
            <span className="color-value">{accentColor}</span>
            <button 
              className="save-preset-btn"
              onClick={handleSavePreset}
              disabled={presets.includes(accentColor)}
              aria-label="Save current color as preset"
            >
              Save as Preset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationDropdown;
