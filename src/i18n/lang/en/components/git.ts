const git: LComponentsGit = {
  form: {
    repoUrl: 'Repo URL',
    name: 'Name',
    currentBranch: 'Current Branch',
    authType: 'Auth Type',
    username: 'Username',
    password: 'Password',
    privateKey: 'Private Key',
    status: 'Status',
    error: 'Error',
    autoPull: 'Auto Pull',
  },
  common: {
    currentBranch: 'Current Branch',
    message: {
      success: {
        checkout: 'Checkout successfully',
        pull: 'Pulled successfully',
        commit: 'Committed successfully',
      },
    },
    messageBox: {
      confirm: {
        pull: 'Are you sure to pull from remote?',
      },
      prompt: {
        commit: {
          label: 'Are you sure to commit?',
          placeholder: 'Commit Message',
        },
      },
    },
    actions: {
      pull: 'Git Pull',
      commit: 'Git Commit',
    },
    status: {
      loading: {
        label: 'Loading',
        tooltip: 'Loading Git data from remote, please wait...',
      },
    },
  },
  branches: {
    select: 'Select Branch',
    new: 'New Branch',
    local: 'Local Branch',
    remote: 'Remote Branch',
  },
  actions: {
    title: 'Git Actions',
    label: {
      retry: 'Retry',
      pull: 'Pull',
      commit: 'Commit',
      checkout: 'Checkout',
    },
    tooltip: {
      retry: 'Retry',
      pull: 'Pull',
      commit: 'Commit and Push',
      checkout: 'Checkout',
    },
  },
  status: {
    label: {
      pending: 'Pending',
      cloning: 'Cloning',
      ready: 'Ready',
      error: 'Error',
      unknown: 'Unknown',
    },
    tooltip: {
      pending: 'Git repo is pending to be cloned',
      cloning: 'Git repo is cloning',
      ready: 'Git repo is ready',
      error: 'Git repo has error during cloning',
      unknown: 'Unknown git repo status',
    },
  },
  tabs: {
    remote: 'Remote',
    references: 'References',
    logs: 'Logs',
    changes: 'Changes',
    ignore: 'Ignore',
  },
  checkout: {
    type: 'Type',
    reference: 'Reference',
  },
  references: {
    type: {
      branch: 'Branch',
      tag: 'Tag',
    },
    table: {
      columns: {
        timestamp: 'Timestamp',
      },
    },
  },
  logs: {
    table: {
      columns: {
        reference: 'Reference',
        commitMessage: 'Commit Message',
        author: 'Author',
        timestamp: 'Timestamp',
      },
    },
  },
  changes: {
    status: {
      untracked: 'Untracked',
      modified: 'Modified',
      added: 'Added',
      deleted: 'Deleted',
      renamed: 'Renamed',
      copied: 'Copied',
      updatedButUnmerged: 'Updated but Unmerged',
    },
    table: {
      columns: {
        changedFile: 'Changed File',
        status: 'Status',
      },
    },
  },
  ignore: {
    table: {
      columns: {
        file: 'File',
      },
    },
  },
};

export default git;
