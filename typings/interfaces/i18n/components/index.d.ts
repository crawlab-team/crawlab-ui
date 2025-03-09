export declare global {
  interface LComponents {
    // common components
    chart: LComponentsChart;
    table: LComponentsTable;
    dialog: LComponentsDialog;
    transfer: LComponentsTransfer;
    nav: LComponentsNav;
    tab: LComponentsTab;
    git: LComponentsGit;
    empty: LComponentsEmpty;
    form: LComponentsForm;
    file: LComponentsFile;
    date: LComponentsDate;
    lexical: LComponentsLexical;
    metric: LComponentsMetric;
    export: LComponentsExport;
    result: LComponentsResult;
    database: LComponentsDatabase;
    environment: LComponentsEnvironment;
    notification: LComponentsNotification;
    editor: LComponentsEditor;
    ai: LAi;

    // model-related components
    node: LComponentsNode;
    project: LComponentsProject;
    spider: LComponentsSpider;
    schedule: LComponentsSchedule;
    task: LComponentsTask;
    user: LComponentsUser;
    role: LComponentsRole;
    tag: LComponentsTag;
  }
}
