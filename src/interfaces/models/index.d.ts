export declare global {
  interface BaseModel {
    _id?: string;
    created_ts?: string;
    created_by?: string;
    updated_at?: string;
    updated_ts?: string;

    [field: string]: any;
  }
}

export * from './dataCollection';
export * from './git';
export * from './node';
export * from './plugin';
export * from './project';
export * from './result';
export * from './setting';
export * from './spider';
export * from './stats';
export * from './systemInfo';
export * from './tag';
export * from './token';
export * from './metric';
export * from './range';
export * from './nav';
export * from './map';
export * from './treeNode';
export * from './user';
