import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose }) => {
  const [key, setKey] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-brand-surface rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-accent">ตั้งค่า Gemini API Key</h2>
          <button onClick={onClose} className="text-brand-text-dark hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <p className="text-brand-text-dark mb-4">
          กรุณาใส่ Gemini API Key ของคุณเพื่อใช้งานฟีเจอร์ AI Key ของคุณจะถูกจัดเก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-brand-text-dark mb-1">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-brand-secondary p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none"
              placeholder="วาง API Key ของคุณที่นี่"
            />
          </div>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-brand-primary hover:underline"
          >
            รับ API Key จาก Google AI Studio
          </a>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="bg-brand-primary text-white font-bold px-6 py-2 rounded-md hover:bg-opacity-80 transition-colors disabled:bg-brand-secondary disabled:cursor-not-allowed"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};