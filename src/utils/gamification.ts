export function addXP(currentXP: number, currentLevel: number, amount: number) {
  const newXP = currentXP + amount;
  const newLevel = Math.max(currentLevel, Math.floor(newXP / 1000) + 1);
  return { xp: newXP, level: newLevel };
}

export const STREAK_BADGE_THRESHOLD = 14; // b5
export const XP_BADGE_THRESHOLD = 15000; // b6
export const MISSIONS_BADGE_THRESHOLD = 20; // b7

export function checkBadgeThresholds(streakDays: number, currentXP: number, completedMissionCount: number) {
  return {
    b5: streakDays >= STREAK_BADGE_THRESHOLD,
    b6: currentXP >= XP_BADGE_THRESHOLD,
    b7: completedMissionCount >= MISSIONS_BADGE_THRESHOLD,
  };
}
