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
    urlInvalid: 'Invalid URL',
    spider: 'Spider',
    cloneLogs: 'Clone Logs',
  },
  common: {
    currentBranch: 'Current Branch',
    message: {
      success: {
        checkout: 'Switched to {branch}',
        pull: 'Pulled successfully',
        commit: '1 file committed | {fileCount} files committed',
        push: 'Pushed successfully',
        createSpider: {
          title: 'Spider created successfully.',
          action: 'View spider',
        },
      },
    },
    messageBox: {
      confirm: {
        branch: {
          delete: 'Are you sure to delete this branch?',
        },
        push: 'Are you sure to push to remote?',
      },
      prompt: {
        branch: {
          new: {
            title: 'New Branch Name',
            validate: {
              notEmpty: 'Cannot be empty',
              notSame: 'Cannot be the same as current branch',
            },
          },
        },
        commit: {
          title: 'Commit Message',
          placeholder: 'Please enter commit message',
          validate: {
            notEmpty: 'Cannot be empty',
          },
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
    box: {
      title: {
        pull: 'Git Pull',
        push: 'Git Push',
      },
    },
  },
  branches: {
    select: 'Select Branch',
    new: 'New Branch',
    local: 'Local Branch',
    remote: 'Remote Branch',
    pull: 'Pull',
    commit: 'Commit',
    push: 'Push',
  },
  tags: {
    new: 'New Tag',
  },
  actions: {
    title: 'Git Actions',
    label: {
      retry: 'Retry',
      checkout: 'Checkout',
      pull: 'Pull',
      commit: 'Commit',
      rollback: 'Rollback',
      push: 'Push',
    },
    tooltip: {
      retry: 'Retry',
      checkout: 'Checkout',
      pull: 'Pull from the remote repository',
      commit: 'Commit code',
      rollback: 'Rollback changes',
      push: 'Push to the remote repository',
    },
  },
  status: {
    label: {
      pending: 'Pending',
      cloning: 'Cloning',
      ready: 'Ready',
      error: 'Error',
      pulling: 'Pulling',
      pushing: 'Pushing',
      unknown: 'Unknown',
    },
    tooltip: {
      pending: 'Git repo is pending to be cloned',
      cloning: 'Git repo is cloning',
      ready: 'Git repo is ready',
      error: 'Git repo has error during cloning',
      pulling: 'Git repo is pulling',
      pushing: 'Git repo is pushing',
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
      actions: {
        add: 'Add',
        rollback: 'Rollback',
        diff: 'Show Diff',
      },
      empty: 'Nothing to commit, work tree clean',
    },
  },
  spiders: {
    title: 'Spiders Actions',
    actions: {
      label: {
        create: 'Create Spider',
      },
      tooltip: {
        create: 'Create a new spider',
      },
    },
    gitRootPath: 'Git Root Path',
  },
  diff: {
    title: 'File Diff',
  },
  providers: {
    github: 'GitHub',
    bitbucket: 'Bitbucket',
    gitlab: 'GitLab',
    aws: 'AWS',
    git: 'Git',
  },
};

export default git;
