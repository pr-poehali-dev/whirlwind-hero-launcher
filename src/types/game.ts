export type AttackType = 'crushing' | 'slashing' | 'energy';
export type ObstacleType = 'stone' | 'wood' | 'magic';
export type Era = 'ice_age' | 'vikings' | 'samurai' | 'renaissance' | 'steampunk' | 'cyber';

export interface Hero {
  id: number;
  name: string;
  era: string;
  attackType: AttackType;
  damage: number;
  health: number;
  maxHealth: number;
  speed: number;
  magic: number;
  level: number;
  icon: string;
  color: string;
  ultiCharge: number;
  maxUltiCharge: number;
  passive: string;
  ulti: string;
}

export interface Obstacle {
  id: number;
  lane: number;
  type: ObstacleType;
  health: number;
  maxHealth: number;
  icon: string;
  color: string;
}

export interface Enemy {
  id: number;
  lane: number;
  type: ObstacleType;
  health: number;
  maxHealth: number;
  icon: string;
  color: string;
}

export interface Collectible {
  id: number;
  lane: number;
  type: 'coin' | 'crystal' | 'boost';
  icon: string;
  value: number;
}

export interface EraConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  obstacles: ObstacleType[];
  enemies: string[];
  bgGradient: string;
}
