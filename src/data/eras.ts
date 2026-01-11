import { EraConfig, Era } from '@/types/game';

export const ERAS: Record<Era, EraConfig> = {
  ice_age: {
    name: 'Ледниковый Период',
    colors: {
      primary: '#06B6D4',
      secondary: '#E0F2FE',
      accent: '#67E8F9',
    },
    obstacles: ['stone', 'stone', 'magic'],
    enemies: ['🦣', '🐺', '❄️'],
    bgGradient: 'from-cyan-900 via-blue-900 to-slate-900',
  },
  vikings: {
    name: 'Эпоха Викингов',
    colors: {
      primary: '#F97316',
      secondary: '#FED7AA',
      accent: '#FB923C',
    },
    obstacles: ['wood', 'stone', 'wood'],
    enemies: ['⚔️', '🛡️', '🔥'],
    bgGradient: 'from-orange-900 via-red-900 to-amber-900',
  },
  samurai: {
    name: 'Эпоха Самураев',
    colors: {
      primary: '#DC2626',
      secondary: '#FEE2E2',
      accent: '#F87171',
    },
    obstacles: ['wood', 'magic', 'wood'],
    enemies: ['🗡️', '🏮', '🌸'],
    bgGradient: 'from-red-900 via-rose-900 to-pink-900',
  },
  renaissance: {
    name: 'Эпоха Возрождения',
    colors: {
      primary: '#D946EF',
      secondary: '#F5E6FF',
      accent: '#E879F9',
    },
    obstacles: ['stone', 'wood', 'magic'],
    enemies: ['🎨', '📜', '⚗️'],
    bgGradient: 'from-purple-900 via-fuchsia-900 to-violet-900',
  },
  steampunk: {
    name: 'Эра Пара',
    colors: {
      primary: '#92400E',
      secondary: '#FED7AA',
      accent: '#B45309',
    },
    obstacles: ['stone', 'stone', 'magic'],
    enemies: ['⚙️', '🔧', '💨'],
    bgGradient: 'from-amber-900 via-yellow-900 to-orange-900',
  },
  cyber: {
    name: 'Кибер-Эра',
    colors: {
      primary: '#8B5CF6',
      secondary: '#DDD6FE',
      accent: '#A78BFA',
    },
    obstacles: ['magic', 'magic', 'stone'],
    enemies: ['🤖', '💾', '⚡'],
    bgGradient: 'from-violet-900 via-purple-900 to-indigo-900',
  },
};

export const ERA_SEQUENCE: Era[] = ['ice_age', 'vikings', 'samurai', 'renaissance', 'steampunk', 'cyber'];

export const getEraByDistance = (distance: number): Era => {
  const eraIndex = Math.floor(distance / 300) % ERA_SEQUENCE.length;
  return ERA_SEQUENCE[eraIndex];
};
