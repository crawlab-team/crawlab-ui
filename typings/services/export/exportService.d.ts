declare const useExportService: () => {
    postExport: (type: ExportType, target: string, conditions?: FilterConditionData[]) => Promise<ResponseWithData<string>>;
    getExport: (type: ExportType, id: string) => Promise<ResponseWithData<any>>;
    getExportDownload: (type: ExportType, id: string) => Promise<string>;
};
export default useExportService;
