export declare global {
  interface Setting<T = Record<string, any>> extends BaseModel {
    key: string;
    value: T;
  }

  interface SettingCustomize {
    custom_title?: string;
    show_custom_title?: boolean;
    custom_logo?: string;
    show_custom_logo?: boolean;
    hide_platform_version?: boolean;
  }

  interface SettingDependency {
    auto_install?: boolean;
  }
}
