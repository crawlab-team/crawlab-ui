import useRequest from '@/services/request';

const { get } = useRequest();
export const getEventParamsWrapped = (
  eventParams?: TrackEventParams
): TrackEventParamsWrapped => {
  if (!eventParams) return {};
  const res: TrackEventParamsWrapped = {};
  Object.keys(eventParams).forEach(key => {
    const value = eventParams[key];
    if (typeof value === 'function') {
      res[key] = value();
    } else {
      res[key] = value;
    }
  });
  return res;
};
