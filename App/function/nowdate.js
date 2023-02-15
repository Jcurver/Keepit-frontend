import moment from 'moment-timezone';

export const nowDate = (type = 'full') => {
  switch (type) {
    case 'date':
      return moment().tz('Asia/Seoul').format('YYYY-MM-DD');
    case 'full':
      return moment().tz('Asia/Seoul').format('YYYY-MM-DD hh:mm:ss a');
    case 'time':
      return moment().tz('Asia/Seoul').format('hh:mm:ss');
    case 1:
      return moment().subtract(1, 'day').tz('Asia/Seoul').format('YYYY-MM-DD');
    case 2:
      return moment().subtract(2, 'day').tz('Asia/Seoul').format('YYYY-MM-DD');
    case 3:
      return moment().subtract(3, 'day').tz('Asia/Seoul').format('YYYY-MM-DD');
    case '.':
      return moment()
        .tz('Asia/Seoul')
        .format('YYYY-MM-DD')
        .split('-')
        .join('.');
  }
};
