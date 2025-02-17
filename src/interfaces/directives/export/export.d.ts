export declare global {
  type ExportType = 'csv' | 'json';

  type ExportDirectiveTarget = string | (() => string);

  type ExportDirectiveConditions =
    | FilterConditionData[]
    | (() => FilterConditionData[]);

  interface ExportDirectivePayload {
    target: ExportDirectiveTarget;
    conditions?: ExportDirectiveConditions;
    dbId?: string;
  }

  type ExportDirective = ExportDirectiveTarget | ExportDirectivePayload;
}
