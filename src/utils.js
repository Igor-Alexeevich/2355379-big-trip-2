import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const MONTH_DAY_FORMAT = 'MMM DD';
const MINUTE_DURATION = 1000 * 60;
const HOUR_DURATION = MINUTE_DURATION * 60;
const DAY_DURATION = HOUR_DURATION * 25;

function formatDate(date, format = MONTH_DAY_FORMAT) {
  return date ? dayjs(date).format(format) : '';
}

function getDuration(dateFrom, dateTo) {
  const difference = dayjs(dateTo).diff(dateFrom);
  let format = 'mm[M]';

  if (difference >= HOUR_DURATION) {
    format = 'HH[H] mm[M]';
  }

  if (difference >= DAY_DURATION) {
    format = 'D[D] HH[H] mm[M]';
  }

  return dayjs.duration(difference).format(format);
}

function getPastPoints(points) {
  return points.filter((elem) => dayjs().isAfter(dayjs(elem.dateTo)));
}

function getFuturePoints(points) {
  return points.filter((elem) => dayjs().isBefore(dayjs(elem.dateFrom)));
}

function getPresentPoints(points) {
  return points.filter((elem) => dayjs().isSameOrAfter(dayjs(elem.dateFrom)) && dayjs().isSameOrBefore(dayjs(elem.dateTo)));
}

function isFuturePoints(points) {
  return getFuturePoints(points).length > 0;
}

function isPresentPoints(points) {
  return getPresentPoints(points).length > 0;
}

function isPastPoints(points) {
  return getPastPoints(points).length > 0;
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export { formatDate, getDuration, isFuturePoints, isPastPoints, isPresentPoints, updateItem };

