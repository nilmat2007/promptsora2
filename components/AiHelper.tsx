
import React, { useState } from 'react';

interface AiHelperProps {
    onGenerate: (idea: string) => void;
    isLoading: boolean;
    error: string | null;
}

export const AiHelper: React.FC<AiHelperProps> = ({ onGenerate, isLoading, error }) => {
    const [idea, setIdea] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim() && !isLoading) {
            onGenerate(idea);
        }
    };

    return (
        <section className="bg-brand-surface/50 border border-brand-primary/30 p-6 rounded-lg shadow-lg mb-8 animate-fade-in">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-semibold">
                    <span className="text-brand-accent">เริ่มต้นด้วย AI ✨</span>
                </h2>
                <p className="text-brand-text-dark mt-1">อธิบายไอเดียของคุณ แล้วให้ AI จัดการที่เหลือ</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="เช่น ชายคนหนึ่งเจอกล้องเก่าปริศนา"
                    className="flex-grow bg-brand-secondary p-3 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none placeholder-brand-text-dark"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !idea.trim()}
                    className="bg-brand-primary text-white font-bold px-6 py-3 rounded-md hover:bg-opacity-80 transition-colors disabled:bg-brand-secondary disabled:cursor-not-allowed disabled:text-brand-text-dark"
                >
                    {isLoading ? 'กำลังสร้าง...' : 'สร้าง Prompt'}
                </button>
            </form>
            {error && <p className="text-red-400 text-center mt-4 text-sm">{error}</p>}
        </section>
    );
};
