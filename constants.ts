
import { Genre, Duration } from './types';

export const GENRES: Genre[] = ['สยองขวัญ', 'โฆษณาสินค้า', 'รีวิว', 'ตลก', 'ภาพยนตร์'];
export const DURATIONS: Duration[] = [15, 30, 45];

export const CAMERA_ANGLES: string[] = [
  'มุมมองบุคคลที่หนึ่ง (POV)',
  'มุมมองข้ามไหล่',
  'มุมต่ำ',
  'ถือกล้องสั่นเล็กน้อย (Handheld)',
  'ดอลลี่เข้า / ดอลลี่ซูม',
  'โคลสอัพถ่ายทอดอารมณ์',
  'มาโครโคลสอัพ',
];

export const LIGHTING_STYLES: string[] = [
  'แสงสไตล์ Netflix',
  'แสงแบบ Low-key',
  'แสงหลักโทนอุ่นนุ่ม + เงาดำ',
  'แสงกระพริบ (สำหรับแนวสยองขวัญ)',
  'ย้อนแสง (Backlight)',
  'แสงที่ขอบ (Glow edge)',
  'โทนสีน้ำเงิน/เขียวอมฟ้า',
];