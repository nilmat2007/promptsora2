import React, { useRef } from 'react';
import type { ReferenceImage } from '../types';

interface ReferenceImagesProps {
  images: ReferenceImage[];
  onFilesSelect: (files: File[]) => void;
  onRemove: (id: number) => void;
}

export const ReferenceImages: React.FC<ReferenceImagesProps> = ({ images, onFilesSelect, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelect(Array.from(event.target.files));
      // Reset file input to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="bg-brand-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-2 text-brand-accent">ภาพอ้างอิง (ตัวเลือกเสริม)</h2>
      <p className="text-sm text-brand-text-dark mb-4">
        แนบได้สูงสุด 3 ภาพ AI จะใช้ภาพเหล่านี้เป็นแรงบันดาลใจสำหรับสไตล์, ตัวละคร, หรือสถานที่
      </p>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
        {images.map((image) => (
          <div key={image.id} className="relative group aspect-square">
            <img src={image.base64} alt="Reference" className="w-full h-full object-cover rounded-md" />
            <button
              onClick={() => onRemove(image.id)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="ลบรูปภาพ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {images.length < 3 && (
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleButtonClick}
            className="w-full bg-brand-secondary text-brand-text-light p-3 rounded-md border-2 border-dashed border-brand-secondary hover:border-brand-primary transition-colors"
          >
            + เพิ่มภาพ ({images.length}/3)
          </button>
        </div>
      )}
    </section>
  );
};