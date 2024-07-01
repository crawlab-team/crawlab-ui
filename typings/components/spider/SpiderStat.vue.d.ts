import { PropType } from 'vue';
declare const _default: import("vue").DefineComponent<{
    stat: {
        type: PropType<SpiderStat>;
        required: false;
    };
}, {
    tooltips: import("vue").ComputedRef<SpiderStatTooltips>;
    labels: import("vue").ComputedRef<SpiderStatLabels>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("tasks-click" | "results-click" | "duration-click")[], "tasks-click" | "results-click" | "duration-click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    stat: {
        type: PropType<SpiderStat>;
        required: false;
    };
}>> & {
    "onTasks-click"?: ((...args: any[]) => any) | undefined;
    "onResults-click"?: ((...args: any[]) => any) | undefined;
    "onDuration-click"?: ((...args: any[]) => any) | undefined;
}, {}, {}>;
export default _default;
