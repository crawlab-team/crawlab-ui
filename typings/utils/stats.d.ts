import { Dayjs } from 'dayjs';
export declare const DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
export declare const spanDateRange: (start: Dayjs | string, end: Dayjs | string, data: StatsResult[], dateKey?: string) => StatsResult[];
