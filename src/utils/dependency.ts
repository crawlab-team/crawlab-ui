export const getRepoExternalPath = (repo: DependencyRepo) => {
  switch (repo.type) {
    case 'python':
      return `https://pypi.org/project/${repo.name}`;
    case 'node':
      return `https://www.npmjs.com/package/${repo.name}`;
    case 'go':
      return `https://pkg.go.dev/${repo.name}`;
    case 'java':
      return `https://mvnrepository.com/artifact/${getRepoName(repo)}`;
    default:
      return '';
  }
};

export const getRepoName = (repo: DependencyRepo) => {
  switch (repo.type) {
    case 'go':
      if (repo.name!.startsWith('github.com/')) {
        return repo.name!.split('github.com/')[1];
      }
      return repo.name;
    case 'java':
      return repo.name!.replaceAll(':', '/');
    default:
      return repo.name;
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
  if (!dependencies?.filter(dep => !!dep.version)?.length) {
    return [getEmptyDependency()];
  }
  return dependencies;
};
