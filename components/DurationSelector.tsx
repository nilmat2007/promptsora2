import React from 'react';
// FIX: The 'Duration' type is defined in '../types' and was incorrectly imported from '../constants'.
import { DURATIONS } from '../constants';
import type { Duration } from '../types';

interface DurationSelectorProps {
  selectedDuration: Duration;
  onChange: (duration: Duration) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({ selectedDuration, onChange }) => {
  return (
    <div>
        <label className="block text-sm font-medium text-brand-text-dark mb-1">ความยาววิดีโอ</label>
        <div className="flex bg-brand-secondary rounded-md p-1">
            {DURATIONS.map(duration => (
                <button
                    key={duration}
                    onClick={() => onChange(duration)}
                    className={`w-full text-center text-sm font-semibold py-1.5 rounded-md transition-colors ${
                        selectedDuration === duration
                            ? 'bg-brand-primary text-white shadow'
                            : 'text-brand-text-dark hover:bg-brand-secondary/50'
                    }`}
                >
                    {duration}วิ
                </button>
            ))}
        </div>
    </div>
  );
};