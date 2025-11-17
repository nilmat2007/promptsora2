import React, { useState, useEffect } from 'react';
import type { Character, SavedCameo } from '../types';

interface CharacterCardProps {
  character: Character;
  onChange: (id: number, field: keyof Character, value: string | boolean) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
  savedCameos: SavedCameo[];
  onSaveCameo: (cameo: SavedCameo) => void;
}

const initialNewCameoState = { id: '', identifier: '', name: '', gender: '', age: '' };

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onChange, onRemove, canRemove, savedCameos, onSaveCameo }) => {
  const [isAddingNewCameo, setIsAddingNewCameo] = useState(false);
  const [newCameo, setNewCameo] = useState<SavedCameo>(initialNewCameoState);

  useEffect(() => {
    // If we switch to cameo mode but no description is set, assume adding new.
    if (character.isCameo && !character.description) {
        setIsAddingNewCameo(true);
    }
    // If we switch away from cameo mode, reset the "add new" state.
    if (!character.isCameo) {
        setIsAddingNewCameo(false);
        setNewCameo(initialNewCameoState);
    }
  }, [character.isCameo, character.description]);

  const handleToggleCameo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    onChange(character.id, 'isCameo', isChecked);
    // Clear description when toggling to avoid lingering identifiers
    onChange(character.id, 'description', '');
    if (!isChecked) {
        // If toggling off, also clear gender/age which might have been populated by a cameo
        onChange(character.id, 'gender', '');
        onChange(character.id, 'age', '');
    }
  };

  const handleCameoSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsAddingNewCameo(true);
      setNewCameo(initialNewCameoState);
      onChange(character.id, 'description', '');
    } else {
      setIsAddingNewCameo(false);
      const selectedCameo = savedCameos.find(c => c.id === value);
      if (selectedCameo) {
        onChange(character.id, 'description', selectedCameo.id);
        onChange(character.id, 'name', selectedCameo.name);
        onChange(character.id, 'gender', selectedCameo.gender);
        onChange(character.id, 'age', selectedCameo.age);
      }
    }
  };
  
  const handleNewCameoChange = (field: keyof SavedCameo, value: string) => {
    const updatedCameo = { ...newCameo, [field]: value };
    if(field === 'identifier') {
        updatedCameo.id = value;
    }
    setNewCameo(updatedCameo);
  }

  const handleSaveCameo = () => {
    if(newCameo.identifier.trim() && newCameo.name.trim()){
      onSaveCameo(newCameo);
      onChange(character.id, 'description', newCameo.id); // Select the newly saved cameo
      setIsAddingNewCameo(false);
      setNewCameo(initialNewCameoState);
    }
  }

  const canSave = newCameo.identifier.trim() && newCameo.name.trim() && !savedCameos.some(c => c.id === newCameo.identifier.trim());

  return (
    <div className="bg-brand-secondary p-4 rounded-md border border-brand-secondary/50 relative">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
            <div className="flex-grow pr-2">
                <label htmlFor={`char-name-${character.id}`} className="block text-xs font-medium text-brand-text-dark mb-1">ชื่อ</label>
                <input
                    type="text"
                    id={`char-name-${character.id}`}
                    value={character.name}
                    onChange={(e) => onChange(character.id, 'name', e.target.value)}
                    className="w-full bg-brand-bg p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"
                    disabled={character.isCameo && !isAddingNewCameo}
                />
            </div>
            <div className="flex items-center gap-2 pt-6">
                <label htmlFor={`char-cameo-${character.id}`} className="text-xs font-medium text-brand-text-dark whitespace-nowrap">
                    Cameo
                </label>
                <input
                    type="checkbox"
                    id={`char-cameo-${character.id}`}
                    checked={character.isCameo}
                    onChange={handleToggleCameo}
                    className="form-checkbox h-4 w-4 rounded bg-brand-bg text-brand-primary focus:ring-brand-primary border-brand-secondary"
                    style={{ accentColor: 'var(--color-brand-primary)' }}
                />
            </div>
        </div>

        {!character.isCameo && (
             <div className="grid grid-cols-2 gap-2">
                 <div>
                    <label htmlFor={`char-gender-${character.id}`} className="block text-xs font-medium text-brand-text-dark mb-1">เพศ</label>
                    <input type="text" id={`char-gender-${character.id}`} value={character.gender} onChange={(e) => onChange(character.id, 'gender', e.target.value)} className="w-full bg-brand-bg p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"/>
                </div>
                <div>
                    <label htmlFor={`char-age-${character.id}`} className="block text-xs font-medium text-brand-text-dark mb-1">อายุ</label>
                    <input type="text" id={`char-age-${character.id}`} value={character.age} onChange={(e) => onChange(character.id, 'age', e.target.value)} className="w-full bg-brand-bg p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"/>
                </div>
            </div>
        )}
        
        {character.isCameo ? (
          <div className="space-y-2">
            <div>
              <label htmlFor={`char-cameo-select-${character.id}`} className="block text-xs font-medium text-brand-text-dark mb-1">เลือก Cameo</label>
              <select 
                id={`char-cameo-select-${character.id}`}
                value={isAddingNewCameo ? 'new' : character.description}
                onChange={handleCameoSelection}
                className="w-full bg-brand-bg p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"
              >
                  <option value="" disabled>-- เลือก --</option>
                  {savedCameos.map(cameo => (
                      <option key={cameo.id} value={cameo.id}>{cameo.name} ({cameo.identifier})</option>
                  ))}
                  <option value="new">...เพิ่ม Cameo ใหม่</option>
              </select>
            </div>

            {isAddingNewCameo && (
              <div className="bg-brand-bg/50 p-3 rounded-md space-y-2 mt-2 border border-brand-primary/20">
                <p className="text-xs font-semibold text-brand-accent">บันทึก Cameo ใหม่</p>
                 <div>
                     <label className="block text-xs font-medium text-brand-text-dark mb-1">Cameo Identifier (ห้ามซ้ำ)</label>
                    <input type="text" value={newCameo.identifier} onChange={(e) => handleNewCameoChange('identifier', e.target.value)} className="w-full bg-brand-secondary p-2 rounded-md border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm" placeholder="@username หรือชื่อเฉพาะ"/>
                  </div>
                 <div>
                     <label className="block text-xs font-medium text-brand-text-dark mb-1">ชื่อที่แสดง</label>
                    <input type="text" value={newCameo.name} onChange={(e) => handleNewCameoChange('name', e.target.value)} className="w-full bg-brand-secondary p-2 rounded-md border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"/>
                  </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                     <label className="block text-xs font-medium text-brand-text-dark mb-1">เพศ</label>
                    <input type="text" value={newCameo.gender} onChange={(e) => handleNewCameoChange('gender', e.target.value)} className="w-full bg-brand-secondary p-2 rounded-md border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"/>
                  </div>
                   <div>
                     <label className="block text-xs font-medium text-brand-text-dark mb-1">อายุ</label>
                    <input type="text" value={newCameo.age} onChange={(e) => handleNewCameoChange('age', e.target.value)} className="w-full bg-brand-secondary p-2 rounded-md border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"/>
                  </div>
                </div>
                  <button onClick={handleSaveCameo} disabled={!canSave} className="w-full mt-2 px-3 py-2 bg-brand-primary text-white rounded-md text-xs font-semibold hover:bg-opacity-80 transition-colors disabled:bg-brand-secondary/50 disabled:cursor-not-allowed">
                    บันทึก Cameo นี้
                  </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label htmlFor={`char-desc-${character.id}`} className="block text-xs font-medium text-brand-text-dark mb-1">คำอธิบาย</label>
            <textarea
              id={`char-desc-${character.id}`}
              value={character.description}
              onChange={(e) => onChange(character.id, 'description', e.target.value)}
              rows={2}
              className="w-full bg-brand-bg p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm"
              placeholder="ลักษณะ, เสื้อผ้า, บุคลิก..."
            />
          </div>
        )}
      </div>
      {canRemove && (
        <button
          onClick={() => onRemove(character.id)}
          className="absolute top-2 right-2 text-brand-text-dark hover:text-red-500 transition-colors"
          aria-label="ลบตัวละคร"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};