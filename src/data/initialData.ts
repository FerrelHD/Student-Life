import { Badge } from '../types';

// Badge catalog only (title/subtitle/icon/tier) — this never varies per user,
// so it stays static here. Per-user unlock state comes from the `user_badges`
// table (see src/lib/db.ts#fetchUnlockedBadgeIds) and is merged in at runtime.
export const initialBadges: Badge[] = [
  {
    id: 'b1',
    title: 'Top Scholar',
    subtitle: '5% TERATAS DI KELAS',
    icon: 'school',
    unlocked: true,
  },
  {
    id: 'b2',
    title: 'Speed Reader',
    subtitle: '50 BUKU DIBACA',
    icon: 'bolt',
    unlocked: true,
  },
  {
    id: 'b3',
    title: 'Logic Master',
    subtitle: '100 TEKA-TEKI SELESAI',
    icon: 'extension',
    unlocked: true,
  },
  {
    id: 'b4',
    title: 'Team Hero',
    subtitle: '10 KOLABORASI',
    icon: 'star',
    unlocked: true,
  },
  {
    id: 'b5',
    title: 'Streak Legend',
    subtitle: '14-HARI STREAK BELAJAR',
    icon: 'local_fire_department',
    unlocked: false,
  },
  {
    id: 'b6',
    title: 'Mastery Alchemist',
    subtitle: 'CAPAI 15.000 TOTAL XP',
    icon: 'workspace_premium',
    unlocked: false,
  },
  {
    id: 'b7',
    title: 'Task Crusher',
    subtitle: 'SELESAIKAN 20 MISI',
    icon: 'task_alt',
    unlocked: false,
  },
  {
    id: 'b8',
    title: 'Night Owl',
    subtitle: 'BELAJAR DI ATAS JAM 10 MALAM',
    icon: 'dark_mode',
    unlocked: false,
  },
];
