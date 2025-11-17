import React, { useState, useCallback } from 'react';

interface GeneratedPromptProps {
  prompts: string[];
  duration: number;
}

export const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ prompts, duration }) => {
  const [copyStatus, setCopyStatus] = useState<Record<number, 'idle' | 'copied'>>({});

  const handleCopy = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(prev => ({ ...prev, [index]: 'copied' }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [index]: 'idle' }));
      }, 2000);
    });
  }, []);

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-brand-accent mb-4">Prompt สำหรับ Sora 2 (แบ่งตามความยาว)</h2>
      
      {prompts.length === 0 && <p className="text-brand-text-dark">Prompt ของคุณจะปรากฏที่นี่...</p>}

      <div className="space-y-6">
        {prompts.map((promptText, index) => {
          const startTime = index * 15;
          const endTime = (index + 1) * 15;

          return (
            <div key={index} className="bg-brand-bg/50 p-4 rounded-md animate-fade-in">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-brand-accent">
                  Prompt {index + 1} ({startTime}-{endTime}วิ)
                </h3>
                <button
                  onClick={() => handleCopy(promptText, index)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 w-24 ${
                    copyStatus[index] === 'copied'
                      ? 'bg-green-500 text-white'
                      : 'bg-brand-primary text-white hover:bg-opacity-80'
                  }`}
                >
                  {copyStatus[index] === 'copied' ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                </button>
              </div>
              <pre className="whitespace-pre-wrap bg-brand-bg p-4 rounded-md text-sm text-brand-text-light font-mono overflow-x-auto">
                {promptText}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
