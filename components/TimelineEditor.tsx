import React from 'react';
import type { Duration, TimelineSegment } from '../types';

interface TimelineEditorProps {
    duration: Duration;
    timeline: TimelineSegment[];
    onChange: (part: number, value: string) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ duration, timeline, onChange }) => {
    
    const render15sTimeline = () => {
        const labels = [
            "0-3วิ (Hook)",
            "3-8วิ (Build-up)",
            "8-13วิ (Payoff)",
            "13-15วิ (Final Impact)"
        ];
        return labels.map((label, index) => (
             <div key={index}>
                <label htmlFor={`timeline-${index}`} className="block text-sm font-medium text-brand-text-dark mb-1">{label}</label>
                <textarea 
                    id={`timeline-${index}`} 
                    value={timeline[index]?.description || ''} 
                    onChange={e => onChange(index + 1, e.target.value)} 
                    rows={2} 
                    className="w-full bg-brand-secondary p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none"
                />
            </div>
        ));
    };

    const renderContinuousTimeline = () => {
        const numParts = (duration / 15);
        return Array.from({ length: numParts }, (_, i) => (
            <div key={i}>
                <h3 className="text-lg font-semibold text-brand-text-light mt-4 mb-2">Part {i + 1} (ต่อเนื่อง)</h3>
                {
                    Array.from({ length: 4 }, (__, j) => {
                        const segmentIndex = i * 4 + j;
                        return (
                             <div key={segmentIndex} className="ml-2">
                                <label htmlFor={`timeline-${segmentIndex}`} className="block text-sm font-medium text-brand-text-dark mb-1">ฉากที่ {j + 1}</label>
                                <textarea 
                                    id={`timeline-${segmentIndex}`} 
                                    value={timeline[segmentIndex]?.description || ''} 
                                    onChange={e => onChange(segmentIndex + 1, e.target.value)} 
                                    rows={2} 
                                    className="w-full bg-brand-secondary p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none mb-2"
                                />
                            </div>
                        )
                    })
                }
            </div>
        ))
    };


    return (
        <section className="bg-brand-surface p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-brand-accent">3. ไทม์ไลน์ไวรัล {duration} วินาที</h2>
            <div className="space-y-4">
                {duration === 15 ? render15sTimeline() : renderContinuousTimeline()}
            </div>
        </section>
    );
};
