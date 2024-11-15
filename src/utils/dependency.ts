export const getRepoExternalPath = (repo: DependencyRepo) => {
  switch (repo.type) {
    case 'python':
      return `https://pypi.org/project/${repo.name}`;
    case 'node':
      return `https://www.npmjs.com/package/${repo.name}`;
    default:
      return '';
  }
};

export const getEmptyDependency = (): Dependency => {
  return {
    version: 'N/A',
  };
};

export const getNormalizedDependencies = (
  dependencies?: Dependency[]
): Dependency[] => {
  if (!dependencies?.length) return [getEmptyDependency()];
  return dependencies;
};
