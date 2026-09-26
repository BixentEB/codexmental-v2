import { getLunarData, lunarSummary } from './lunar-engine.js';

/**
 * Compatibilité avec l'ancien appel de theme-observer.
 * Les calculs lunaires sont désormais centralisés dans lunar-engine.js.
 */
export function getFullMoonInfo(date = new Date()) {
  return lunarSummary(getLunarData(date));
}
