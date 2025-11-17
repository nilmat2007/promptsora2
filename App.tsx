import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PromptData, Genre, Character, ReferenceImage, SavedCameo, Duration, TimelineSegment } from './types';
import { GENRES, CAMERA_ANGLES, LIGHTING_STYLES, DURATIONS } from './constants';
import { generatePromptDetails } from './services/geminiService';
import { CharacterCard } from './components/CharacterCard';
import { GeneratedPrompt } from './components/GeneratedPrompt';
import { AiHelper } from './components/AiHelper';
import { ReferenceImages } from './components/ReferenceImages';
import { DurationSelector } from './components/DurationSelector';
import { TimelineEditor } from './components/TimelineEditor';
import { ApiKeyModal } from './components/ApiKeyModal';

const initialCharacter: Character = {
  id: Date.now(),
  name: 'ตัวละคร A',
  description: 'ผิวซีด, ผมยาวสีเข้ม, สวมเสื้อยืดสีขาวเรียบๆ ดูวิตกกังวล',
  isCameo: false,
  gender: 'หญิง',
  age: '20'
};

const initialState: PromptData = {
  genre: 'สยองขวัญ',
  duration: 15,
  title: '15วิ ไวรัลสยองขวัญ - เงามรณะ - ตอนที่ 1',
  location: 'โถงทางเดินแคบๆ แสงสลัวตอนกลางคืน มีหลอดไฟกระพริบอยู่เหนือศีรษะ วอลล์เปเปอร์ลอก',
  characters: [initialCharacter],
  timeline: [
    { part: 1, description: 'มุมมอง POV ตัวละครหายใจหอบ มองไปตามโถงทางเดินมืดๆ ได้ยินเสียงขีดข่วนเบาๆ จากที่ไกลๆ (Hook)'},
    { part: 2, description: 'ตัวละครก้าวไปข้างหน้าอย่างลังเล กล้องค่อยๆ ดอลลี่เข้าไปยังสุดทางเดิน เสียงขีดข่วนหยุดลง (Build-up)'},
    { part: 3, description: 'เงาร่างสูงเพรียวของร่างที่มีแขนขายาวผิดธรรมชาติปรากฏขึ้นอย่างรวดเร็วที่ปลายสุดของโถงทางเดิน แล้วหายไปเมื่อแสงไฟกระพริบอย่างรุนแรง (Payoff)'},
    { part: 4, description: 'ความเงียบเข้าปกคลุมทันที โคลสอัพที่ดวงตาหวาดกลัวของตัวละคร ภาพนิ่ง (Freeze-frame) (Final Impact)'},
  ],
  camera: 'มุมมองบุคคลที่หนึ่ง (POV)',
  lighting: 'แสงสไตล์ Netflix',
  style: `กล้องสั่นเล็กน้อยในช่วงเวลาที่แสดงอารมณ์
ภาพชัดลึกแบบภาพยนตร์
รักษาความต่อเนื่องของแสง ใบหน้าตัวละคร และสภาพแวดล้อมในห้อง`,
  referenceImages: [],
};

export default function App() {
  const [promptData, setPromptData] = useState<PromptData>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCameos, setSavedCameos] = useState<SavedCameo[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const storedCameos = localStorage.getItem('savedCameos');
      if (storedCameos) {
        setSavedCameos(JSON.parse(storedCameos));
      }
    } catch (e) {
      console.error("Failed to load cameos from localStorage", e);
    }
    
    try {
      const storedApiKey = localStorage.getItem('geminiApiKey');
      if (storedApiKey) {
        setApiKey(storedApiKey);
      } else {
        setIsModalOpen(true);
      }
    } catch (e) {
      console.error("Failed to load API key from localStorage", e);
      setIsModalOpen(true);
    }
  }, []);
  
  const saveCameosToStorage = (cameos: SavedCameo[]) => {
    try {
      localStorage.setItem('savedCameos', JSON.stringify(cameos));
    } catch (e) {
      console.error("Failed to save cameos to localStorage", e);
    }
  };

  const addSavedCameo = useCallback((cameo: SavedCameo) => {
    if (cameo.identifier && !savedCameos.some(c => c.id === cameo.id)) {
      const updatedCameos = [...savedCameos, cameo];
      setSavedCameos(updatedCameos);
      saveCameosToStorage(updatedCameos);
    }
  }, [savedCameos]);

  const handleDataChange = useCallback(<K extends keyof PromptData>(key: K, value: PromptData[K]) => {
    setPromptData(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const handleTimelineChange = useCallback((part: number, value: string) => {
    setPromptData(prev => ({
      ...prev,
      timeline: prev.timeline.map(segment =>
        segment.part === part ? { ...segment, description: value } : segment
      ),
    }));
  }, []);

  const handleCharacterChange = useCallback((id: number, field: keyof Character, value: string | boolean) => {
    setPromptData(prev => ({
      ...prev,
      characters: prev.characters.map(char =>
        char.id === id ? { ...char, [field]: value } : char
      ),
    }));
  }, []);
    
  const handleReferenceImageChange = useCallback((files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (promptData.referenceImages.length + validFiles.length > 3) {
      alert("สามารถอัปโหลดได้สูงสุด 3 รูปภาพเท่านั้น");
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newImage: ReferenceImage = {
          id: Date.now() + Math.random(),
          base64,
          mimeType: file.type,
        };
        setPromptData(prev => ({
          ...prev,
          referenceImages: [...prev.referenceImages, newImage],
        }));
      };
      reader.readAsDataURL(file);
    });
  }, [promptData.referenceImages.length]);

  const handleRemoveReferenceImage = useCallback((id: number) => {
    setPromptData(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.filter(img => img.id !== id),
    }));
  }, []);

  const addCharacter = useCallback(() => {
    const newCharId = Date.now();
    setPromptData(prev => ({
      ...prev,
      characters: [
        ...prev.characters,
        { id: newCharId, name: `ตัวละคร ${prev.characters.length + 1}`, description: '', isCameo: false, gender: '', age: '' },
      ],
    }));
  }, []);

  const removeCharacter = useCallback((id: number) => {
    setPromptData(prev => ({
      ...prev,
      characters: prev.characters.filter(char => char.id !== id),
    }));
  }, []);

  const handleAiGenerate = useCallback(async (idea: string) => {
    if (!apiKey) {
      setError("กรุณาตั้งค่า Gemini API Key ของคุณก่อน");
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const imagePayload = promptData.referenceImages.map(img => ({
        base64: img.base64,
        mimeType: img.mimeType
      }));
      const details = await generatePromptDetails(apiKey, idea, promptData.genre, promptData.duration, imagePayload);
      
      const newTimeline = details.timeline?.length ? details.timeline : promptData.timeline;

      setPromptData(prev => ({
        ...prev,
        title: details.title || prev.title,
        location: details.location || prev.location,
        characters: details.characters?.map((c, i) => ({ 
            id: Date.now() + i, 
            name: c.name, 
            description: c.description, 
            isCameo: c.isCameo ?? false,
            gender: c.gender || '',
            age: c.age || '',
        })) || prev.characters,
        timeline: newTimeline
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, promptData.genre, promptData.duration, promptData.referenceImages]);

  const handleSaveApiKey = useCallback((key: string) => {
    if (key) {
      setApiKey(key);
      try {
        localStorage.setItem('geminiApiKey', key);
        setIsModalOpen(false);
        setError(null);
      } catch (e) {
        console.error("Failed to save API key to localStorage", e);
        setError("ไม่สามารถบันทึก API Key ได้");
      }
    }
  }, []);

  const fullPrompts = useMemo(() => {
    const prompts: string[] = [];
    const numParts = promptData.duration / 15;
    const segmentsPerPart = 4;

    const characterSection = promptData.characters.map(c => {
      if (c.isCameo && c.description.trim()) {
        const cameoIdentifier = c.description.trim();
        const saved = savedCameos.find(sc => sc.id === cameoIdentifier);
        if (saved) {
          return `- ${saved.name} (${saved.gender}, ${saved.age}): Cameo appearance of ${saved.identifier}`;
        }
        return `- ${c.name}: Cameo appearance of ${cameoIdentifier}`;
      }
      const ageGenderInfo = (c.gender && c.age) ? ` (${c.gender}, ${c.age})` : '';
      return `- ${c.name}${ageGenderInfo}: ${c.description}`;
    }).join('\n');

    const styleSection = `STYLE:
- ${promptData.camera}
${promptData.style}`;

    for (let i = 0; i < numParts; i++) {
        const partNumber = i + 1;
        const startIndex = i * segmentsPerPart;
        const endIndex = startIndex + segmentsPerPart;
        const partTimelineSegments = promptData.timeline.slice(startIndex, endIndex);

        const timelineSection = partTimelineSegments.map((segment, index) => {
            const labels = ["Hook (0-3s)", "Build-up (3-8s)", "Payoff (8-13s)", "Final Impact (13-15s)"];
            return `${labels[index]}:\n${segment?.description || ''}`;
        }).join('\n\n');
        
        const originalTitle = promptData.title.replace(/-\s*ตอนที่\s*\d+/i, '').replace(/-\s*Part\s*\d+/i, '').trim();
        const partTitle = `${originalTitle} - ตอนที่ ${partNumber}`;
        
        const continuityInstruction = partNumber > 1 
            ? `This is Part ${partNumber}. This shot MUST continue SEAMLESSLY from the final frame of Part ${partNumber - 1}. Maintain character appearances, lighting, and environment exactly.`
            : '';

        const promptText = `TITLE: "${partTitle}"

Cinematic continuous shot. ${promptData.lighting}. Fixed location: ${promptData.location}. No scene changes. Face consistency for all characters. ${continuityInstruction}

CHARACTERS:
${characterSection}

TIMELINE 15s:
${timelineSection}

${styleSection}`;

        prompts.push(promptText.trim());
    }

    return prompts;
  }, [promptData, savedCameos]);


  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-light font-sans p-4 sm:p-6 lg:p-8">
      <ApiKeyModal 
        isOpen={isModalOpen} 
        onSave={handleSaveApiKey} 
        onClose={() => { if (apiKey) setIsModalOpen(false) }} 
      />
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary text-transparent bg-clip-text pb-2">
            Sora 2 Prompt Architect
          </h1>
          <p className="text-brand-text-dark mt-2">สร้างสรรค์ Prompt ภาพยนตร์ที่สมบูรณ์แบบด้วย AI</p>
        </header>

        <AiHelper onGenerate={handleAiGenerate} isLoading={isLoading} error={error} />
        
        {isLoading && (
          <div className="text-center my-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            <p className="mt-4 text-brand-text-dark animate-pulse-fast">AI กำลังสร้างสรรค์จินตนาการภาพยนตร์ของคุณ...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Left Column: Controls */}
          <div className="space-y-6">
            <section className="bg-brand-surface p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-brand-accent">1. ตั้งค่าหลัก</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-brand-text-dark mb-1">ชื่อเรื่อง (แกนหลัก)</label>
                  <input type="text" id="title" value={promptData.title} onChange={e => handleDataChange('title', e.target.value)} className="w-full bg-brand-secondary p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-brand-text-dark mb-1">แนว</label>
                    <select id="genre" value={promptData.genre} onChange={e => handleDataChange('genre', e.target.value as Genre)} className="w-full bg-brand-secondary p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none h-[42px]">
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <DurationSelector 
                    selectedDuration={promptData.duration}
                    onChange={d => handleDataChange('duration', d)}
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-brand-text-dark mb-1">สถานที่</label>
                  <textarea id="location" value={promptData.location} onChange={e => handleDataChange('location', e.target.value)} rows={3} className="w-full bg-brand-secondary p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                </div>
              </div>
            </section>
            
            <ReferenceImages
              images={promptData.referenceImages}
              onFilesSelect={handleReferenceImageChange}
              onRemove={handleRemoveReferenceImage}
            />

            <section className="bg-brand-surface p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-brand-accent">2. ตัวละคร</h2>
                <button onClick={addCharacter} className="bg-brand-primary text-white px-3 py-1 rounded-md hover:bg-opacity-80 transition-colors text-sm font-semibold">+ เพิ่ม</button>
              </div>
              <div className="space-y-4">
                {promptData.characters.map((char) => (
                  <CharacterCard 
                    key={char.id} 
                    character={char} 
                    onChange={handleCharacterChange} 
                    onRemove={removeCharacter} 
                    canRemove={promptData.characters.length > 1}
                    savedCameos={savedCameos}
                    onSaveCameo={addSavedCameo}
                  />
                ))}
              </div>
            </section>
            
            <TimelineEditor
              duration={promptData.duration}
              timeline={promptData.timeline}
              onChange={handleTimelineChange}
            />

             <section className="bg-brand-surface p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-brand-accent">4. สไตล์ภาพยนตร์</h2>
              <div className="space-y-4">
                 <div>
                    <label htmlFor="camera" className="block text-sm font-medium text-brand-text-dark mb-1">มุมกล้อง</label>
                    <select id="camera" value={promptData.camera} onChange={e => handleDataChange('camera', e.target.value)} className="w-full bg-brand-secondary p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none">
                      {CAMERA_ANGLES.map(angle => <option key={angle} value={angle}>{angle}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="lighting" className="block text-sm font-medium text-brand-text-dark mb-1">แสง</label>
                    <select id="lighting" value={promptData.lighting} onChange={e => handleDataChange('lighting', e.target.value)} className="w-full bg-brand-secondary p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none">
                      {LIGHTING_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                    </select>
                  </div>
                   <div>
                    <label htmlFor="style" className="block text-sm font-medium text-brand-text-dark mb-1">หมายเหตุสไตล์เพิ่มเติม</label>
                    <textarea id="style" value={promptData.style} onChange={e => handleDataChange('style', e.target.value)} rows={4} className="w-full bg-brand-secondary p-2 rounded-md border border-brand-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none"/>
                  </div>
              </div>
            </section>
          </div>
          
          {/* Right Column: Output */}
          <div className="lg:sticky top-8 self-start">
             <GeneratedPrompt prompts={fullPrompts} duration={promptData.duration} />
          </div>
        </div>
      </main>
    </div>
  );
}