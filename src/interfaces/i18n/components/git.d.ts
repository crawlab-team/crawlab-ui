interface LComponentsGit {
  form: {
    repoUrl: string;
    name: string;
    currentBranch: string;
    authType: string;
    username: string;
    password: string;
    privateKey: string;
    status: string;
    error: string;
    autoPull: string;
    urlInvalid: string;
  };
  common: {
    currentBranch: string;
    message: {
      success: {
        checkout: string;
        pull: string;
        commit: string;
        push: string;
      };
    };
    messageBox: {
      confirm: {
        branch: {
          delete: string;
        };
        push: string;
      };
      prompt: {
        branch: {
          new: {
            title: string;
            validate: {
              notEmpty: string;
              notSame: string;
            };
          };
        };
        commit: {
          title: string;
          placeholder: string;
          validate: {
            notEmpty: string;
          };
        };
      };
    };
    actions: {
      pull: string;
      commit: string;
    };
    status: {
      loading: {
        label: string;
        tooltip: string;
      };
    };
  };
  branches: {
    select: string;
    new: string;
    local: string;
    remote: string;
    pull: string;
    commit: string;
    push: string;
  };
  tags: {
    new: string;
  };
  actions: {
    title: string;
    label: {
      retry: string;
      checkout: string;
      pull: string;
      commit: string;
      rollback: string;
      push: string;
    };
    tooltip: {
      retry: string;
      checkout: string;
      pull: string;
      commit: string;
      rollback: string;
      push: string;
    };
  };
  status: {
    label: {
      pending: string;
      cloning: string;
      ready: string;
      error: string;
      unknown: string;
    };
    tooltip: {
      pending: string;
      cloning: string;
      ready: string;
      error: string;
      unknown: string;
    };
  };
  tabs: {
    remote: string;
    references: string;
    logs: string;
    changes: string;
    ignore: string;
  };
  checkout: {
    type: string;
    reference: string;
  };
  references: {
    type: {
      branch: string;
      tag: string;
    };
    table: {
      columns: {
        timestamp: string;
      };
    };
  };
  logs: {
    table: {
      columns: {
        reference: string;
        commitMessage: string;
        author: string;
        timestamp: string;
      };
    };
  };
  changes: {
    status: {
      untracked: string;
      modified: string;
      added: string;
      deleted: string;
      renamed: string;
      copied: string;
      updatedButUnmerged: string;
    };
    table: {
      columns: {
        changedFile: string;
        status: string;
      };
      actions: {
        add: string;
        rollback: string;
      };
      empty: string;
    };
  };
  spiders: {
    title: string;
    actions: {
      label: {
        create: string;
      };
      tooltip: {
        create: string;
      };
    };
  };
}
