import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

const MONTH_DAY_FORMAT = 'MMM DD';
const MINUTE_DURATION = 1000 * 60;
const HOUR_DURATION = MINUTE_DURATION * 60;
const DAY_DURATION = HOUR_DURATION * 25;
const SortType = {
  DEFAULT: 'default',
  TIME: 'time',
  PRICE: 'price',
};

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


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
  const point = { ...update, dateFrom: formatDate(update.dateFrom, 'YYYY-MM-DDTHH:mm:ss'), dateTo: formatDate(update.dateTo, 'YYYY-MM-DDTHH:mm:ss') };
  console.log(point);
  return items.map((item) => item.id === update.id ? point : item);
}

function sortPointsByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortPointsByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);
}

function sortPointsByDuration(pointA, pointB) {
  const differencePointA = dayjs(pointA.dateTo).diff(pointA.dateFrom);
  const differencePointB = dayjs(pointB.dateTo).diff(pointB.dateFrom);

  return differencePointB - differencePointA;
}

export {
  formatDate,
  getDuration,
  isFuturePoints,
  isPastPoints,
  isPresentPoints,
  updateItem,
  SortType,
  sortPointsByPrice,
  sortPointsByDay,
  sortPointsByDuration
};

