import moment from 'moment';
import { nowDate } from './nowdate';

const writtenDate = (createDt, join = '.') => {
  const nowdate = () => nowDate('full');
  const nowdate_moment = moment(nowdate(), 'YYYY-MM-DD hh:mm:ss a');
  const createDt_moment = moment(createDt, 'YYYY-MM-DD hh:mm:ss');
  const hourDiff = moment
    .duration(nowdate_moment.diff(createDt_moment))
    .asHours();
  const minDiff = moment
    .duration(nowdate_moment.diff(createDt_moment))
    .asMinutes();
  const secDiff =
    moment.duration(nowdate_moment.diff(createDt)).asMilliseconds() / 1000;

  switch (createDt?.slice(0, 10)) {
    case nowDate('date'):
      if (secDiff < 60) {
        // return `${Math.floor(secDiff)}초 전`;
        return '방금 전';
      } else if (minDiff < 60) {
        return `${Math.floor(minDiff)}분 전`;
      } else if (hourDiff < 24) {
        return `${Math.floor(hourDiff)}시간 전`;
      }
      break;
    case nowDate(1):
      return '1일 전';
    case nowDate(2):
      return '2일 전';
    case nowDate(3):
      return '3일 전';
    default:
      return createDt?.slice(0, 10).split('-').join(join);
  }
};

export default writtenDate;
