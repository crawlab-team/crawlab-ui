import useRequest from '@/services/request';

const { get, post } = useRequest();

const useExportService = () => {
  const postExport = async (
    type: ExportType,
    target: string,
    conditions?: FilterConditionData[],
    dbId?: string
  ) => {
    const url = dbId ? `/databases/${dbId}/export/${type}` : `/export/${type}`;
    return await post<string>(url, undefined, {
      target,
      conditions: JSON.stringify(conditions || ''),
    });
  };

  const getExport = async (type: ExportType, id: string, dbId?: string) => {
    const url = dbId
      ? `/databases/${dbId}/export/${type}/${id}`
      : `/export/${type}/${id}`;
    return await get(url);
  };

  const getExportDownload = async (
    type: ExportType,
    id: string,
    dbId?: string
  ) => {
    const url = dbId
      ? `/databases/${dbId}/export/${type}/${id}/download`
      : `/export/${type}/${id}/download`;
    return (await get(url)) as string;
  };

  return {
    postExport,
    getExport,
    getExportDownload,
  };
};

export default useExportService;
