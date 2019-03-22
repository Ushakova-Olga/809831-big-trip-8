import makeData from './data.js';
import Point from './point.js';
import PointOpen from './point-open.js';
import Filter from './filter.js';
import {createMoneyChart, createTransportChart} from './statistik.js';

const tripFilterForm = document.querySelector(`.trip-filter`);
const tripDayElement = document.querySelector(`.trip-day__items`);
const statsElement = document.querySelector(`#stats`);
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const containerStatistic = document.querySelector(`.statistic`);

const maxPoints = 10;

const getRandom = (count) => Math.floor(count * Math.random());

const createPoints = (count) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push(makeData(i));
  }
  return points;
};

const deletePoint = (points, i) => {
  points.splice(i, 1);
  return points;
};

const renderFilters = (data, points) => {
  tripFilterForm.innerHTML = ``;

  data.forEach((filter) => {
    const filterComponent = new Filter(filter);
    tripFilterForm.appendChild(filterComponent.render());

    filterComponent.onFilter = () => {
      containerStatistic.classList.add(`visually-hidden`);
      document.querySelector(`main`).classList.remove(`visually-hidden`);
      switch (filterComponent._name) {
        case `Everything`:
          return renderPoints(points);

        case `Past`:
          return renderPoints(points.filter((it) => it.day < Date.now()));

        case `Future`:
          return renderPoints(points.filter((it) => it.day > Date.now()));
      }
      return renderPoints(points);
    };
  });
};

const renderPoints = (points) => {
  tripDayElement.innerHTML = ``;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const pointComponent = new Point(point);
    const pointOpenComponent = new PointOpen(point);

    tripDayElement.appendChild(pointComponent.render());

    pointComponent.onOpen = () => {
      pointOpenComponent.render();
      tripDayElement.replaceChild(pointOpenComponent.element, pointComponent.element);
      pointComponent.unrender();
    };

    pointOpenComponent.onSubmit = (newObject) => {
      point.type = newObject.type;
      point.city = newObject.city;
      point.picture = newObject.picture;
      point.offers = newObject.offers;
      point.time = newObject.time;
      point.price = newObject.price;
      point.duration = newObject.duration;
      point.description = newObject.description;
      pointComponent.update(point);
      pointComponent.render();
      tripDayElement.replaceChild(pointComponent.element, pointOpenComponent.element);
      pointOpenComponent.unrender();
    };

    pointOpenComponent.onReset = () => {
      deletePoint(points, i);
      pointOpenComponent.unrender();
    };
  }
};

const filtersData = [
  {id: `everything`, name: `Everything`, count: getRandom(maxPoints), checked: true},
  {id: `future`, name: `Future`, count: getRandom(maxPoints), checked: false},
  {id: `past`, name: `Past`, count: getRandom(maxPoints), checked: false}
];

let points = [];
points = createPoints(25);
renderFilters(filtersData, points);

const onClickStatistic = function (evt) {
  evt.preventDefault();
  containerStatistic.classList.remove(`visually-hidden`);
  document.querySelector(`main`).classList.add(`visually-hidden`);
  document.querySelector(`.view-switch__item--active`).classList.remove(`view-switch__item--active`);
  document.querySelector(`.view-switch__item--stats`).classList.add(`view-switch__item--active`);
  createMoneyChart(moneyCtx);
  createTransportChart(transportCtx);
};

statsElement.addEventListener(`click`, onClickStatistic);

const onClickTable = function (evt) {
  evt.preventDefault();
  containerStatistic.classList.add(`visually-hidden`);
  document.querySelector(`main`).classList.remove(`visually-hidden`);
  document.querySelector(`.view-switch__item--active`).classList.remove(`view-switch__item--active`);
  document.querySelector(`.view-switch__item--table`).classList.add(`view-switch__item--active`);
};
document.querySelector(`.view-switch__item`).addEventListener(`click`, onClickTable);
