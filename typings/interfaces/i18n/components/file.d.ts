interface LComponentsFile {
  editor: {
    navTabs: {
      close: string;
      closeOthers: string;
      closeAll: string;
      showMore: string;
    };
    navMenu: {
      newFile: string;
      newDirectory: string;
      uploadFiles: string;
      rename: string;
      duplicate: string;
      delete: string;
      createSpider: string;
      deleteSpider: string;
    };
    sidebar: {
      search: {
        placeholder: string;
      };
      settings: string;
      toggle: {
        showFiles: string;
        hideFiles: string;
      };
    };
    empty: {
      placeholder: string;
    };
    messageBox: {
      prompt: {
        newFile: string;
        newDirectory: string;
        rename: string;
        duplicate: string;
      };
      validator: {
        errorMessage: {
          newNameNotSameAsOldName: string;
        };
      };
    };
    settings: {
      title: string;
      form: {
        theme: string;
      };
    };
    createWithAi: {
      title: string;
      form: {
        fileName: string;
        url: string;
        language: string;
        framework: string;
        prompt: string;
      };
    };
  };
  upload: {
    title: string;
    form: {
      mode: string;
      targetDirectory: string;
    };
    buttons: {
      files: {
        dragFilesHereOr: string;
        clickToUpload: string;
      };
      folder: {
        clickToSelectFolderToUpload: string;
      };
    };
    tooltip: {
      folderName: string;
      filesCount: string;
    };
    mode: {
      folder: string;
      files: string;
    };
    fileList: {
      title: string;
    };
  };
  actions: {
    tooltip: {
      fileEditorActions: string;
      createWithAi: string;
      createWithAiDisabled: string;
      uploadFiles: string;
      export: string;
      fileEditorSettings: string;
    };
  };
  rootDirectory: string;
  diff: {
    title: string;
    form: {
      original: string;
      modified: string;
    };
  };
}
