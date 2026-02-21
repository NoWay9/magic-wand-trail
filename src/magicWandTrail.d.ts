export interface WandTrailOptions {
  emoji?: string | string[];
  fadeSpeed?: number;
  speed?: number;
  density?: number;
  respectMotionPrefs?: boolean;
}

export interface WandController {
  destroy: () => void;
}

export function magicWandTrail(options?: WandTrailOptions): WandController;
