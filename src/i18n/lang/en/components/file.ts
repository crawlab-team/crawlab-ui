const file: LComponentsFile = {
  editor: {
    navTabs: {
      close: 'Close',
      closeOthers: 'Close Others',
      closeAll: 'Close All',
      showMore: 'Show More',
    },
    navMenu: {
      newFile: 'New File',
      newDirectory: 'New Directory',
      uploadFiles: 'Upload Files',
      rename: 'Rename',
      duplicate: 'Duplicate',
      delete: 'Delete',
      createSpider: 'Create Spider',
      deleteSpider: 'Delete Spider',
    },
    sidebar: {
      search: {
        placeholder: 'Search files...',
      },
      settings: 'Settings',
      toggle: {
        showFiles: 'Show Files',
        hideFiles: 'Hide Files',
      },
    },
    empty: {
      placeholder:
        'You can edit or view a file by double-clicking one of the files on the left.',
    },
    messageBox: {
      prompt: {
        newFile: 'Please enter the name of the new file',
        newDirectory: 'Please enter the name of the new directory',
        rename: 'Please enter the new name',
        duplicate: 'Please enter the new name',
      },
      validator: {
        errorMessage: {
          newNameNotSameAsOldName:
            'New name cannot be the same as the old name',
        },
      },
    },
    settings: {
      title: 'File Editor Settings',
      form: {
        theme: 'Theme',
      },
    },
    createWithAi: {
      title: 'Create with AI',
      form: {
        fileName: 'File Name',
        url: 'URL',
        language: 'Programming Language',
        framework: 'Framework',
        prompt: 'Prompt',
      },
    },
  },
  upload: {
    title: 'Files Upload',
    form: {
      mode: 'Upload Mode',
      targetDirectory: 'Target Folder',
    },
    buttons: {
      files: {
        dragFilesHereOr: 'Drag files here, or',
        clickToUpload: 'click to upload',
      },
      folder: {
        clickToSelectFolderToUpload: 'Click to select folder to upload',
      },
    },
    tooltip: {
      folderName: 'Folder Name',
      filesCount: 'Files Count',
    },
    mode: {
      folder: 'Folder',
      files: 'Files',
    },
    fileList: {
      title: 'Files to Upload',
    },
  },
  actions: {
    tooltip: {
      fileEditorActions: 'File Editor Actions',
      uploadFiles: 'Upload Files',
      fileEditorSettings: 'File Editor Settings',
      export: 'Export Files',
      createWithAi: 'Create with AI',
      createWithAiDisabled: 'Create with AI (available in Crawlab Pro)',
    },
  },
  rootDirectory: 'Root Directory',
  diff: {
    title: 'File Diff',
    form: {
      original: 'Original',
      modified: 'Modified',
    },
  },
};

export default file;
