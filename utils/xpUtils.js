export const calculateNewXPAndLevel = (currentXp, gainedXp) => {
  const newXp = currentXp + gainedXp;
  const newLevel = Math.floor(newXp / 100) + 1;
  return { newXp, newLevel };
};
