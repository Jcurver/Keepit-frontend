import { KI } from 'api/index.js';

export const getAlarmMain = async ({
  pageSize = 20,
  nextOffset = 'firstPage',
}) => {
  console.log('OFFSET:: ', nextOffset);
  if (nextOffset === 'firstPage') {
    return await KI.get(`/notifications/ACT?pageSize=${pageSize}`);
  } else {
    return await KI.get(
      `/notifications/ACT?pageSize=${pageSize}&nextOffset=${nextOffset}`,
    );
  }
};

export const getAlarmNewsMain = async ({
  pageSize = 20,
  nextOffset = 'firstPage',
}) => {
  console.log('OFFSET:: ', nextOffset);
  if (nextOffset === 'firstPage') {
    return await KI.get(`/notifications/NEWS?pageSize=${pageSize}`);
  } else {
    return await KI.get(
      `/notifications/NEWS?pageSize=${pageSize}&nextOffset=${nextOffset}`,
    );
  }
};

export const getAlarmCheck = async () => {
  return await KI.get('/noti/check');
};
