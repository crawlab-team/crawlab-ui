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
