export const getTimeUnitParts = (timeUnit: string) => {
  const groups = timeUnit.match(/(\d+)([a-z])/);
  const num = parseInt(groups[1]);
  const unit = groups[2];
  return { num, unit };
};
