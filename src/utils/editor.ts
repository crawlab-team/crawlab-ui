export const getLanguageByFileName = (name?: string) => {
  const ext = name?.toLocaleLowerCase().split('.').pop();
  switch (ext) {
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'go':
      return 'go';
    case 'cs':
      return 'csharp';
    case 'php':
      return 'php';
    case 'rb':
      return 'ruby';
    case 'rs':
      return 'rust';
    case 'r':
      return 'r';
    case 'c':
    case 'h':
      return 'cpp';
    case 'scala':
    case 'sc':
      return 'scala';
    case 'sh':
      return 'shell';
    case 'bat':
      return 'bat';
    case 'ps1':
      return 'powershell';
    case 'sql':
      return 'sql';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'less':
      return 'less';
    case 'scss':
      return 'scss';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'xml':
      return 'xml';
    case 'md':
      return 'markdown';
    case 'ini':
    case 'cfg':
    case 'properties':
      return 'ini';
    case 'dockerfile':
      return 'dockerfile';
    default:
      return 'text';
  }
};

export const UPDATE_MARKDOWN_EVENT = 'update-markdown';
