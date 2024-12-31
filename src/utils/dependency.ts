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
    case 'browser':
      return getBrowserRepoExternalPath(repo);
    default:
      return '';
  }

  function getBrowserRepoExternalPath(repo: DependencyRepo) {
    switch (repo.name) {
      case 'chrome':
        return 'https://www.chromium.org/getting-involved/download-chromium/';
      case 'chromedriver':
        return 'https://developer.chrome.com/docs/chromedriver/';
    }
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

export const isDependencyLoading = (dep: Dependency) => {
  return dep.status === 'installing' || dep.status === 'uninstalling';
};

export const getTypeByDep = (dep: Dependency): BasicType | undefined => {
  switch (dep.status) {
    case 'installing':
    case 'uninstalling':
      return 'warning';
    case 'error':
    case 'abnormal':
      return 'danger';
  }
};
