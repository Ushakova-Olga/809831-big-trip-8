import Point from './point.js';
import PointOpen from './point-open.js';
import Filter from './filter.js';
import {createMoneyChart, createTransportChart} from './statistik.js';
import API from './api.js';

const tripFilterForm = document.querySelector(`.trip-filter`);
const tripDayElement = document.querySelector(`.trip-day__items`);
const statsElement = document.querySelector(`#stats`);
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const containerStatistic = document.querySelector(`.statistic`);

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZA8`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});

export let destinationsData = [];
export let destinationsDict = {};
export let offersDict = {};

const maxPoints = 10;

const getRandom = (count) => Math.floor(count * Math.random());

const filteredPoints = (filterName, points) => {

  switch (filterName) {
    case `Everything`:
      return points;

    case `Past`:
      return points.filter((it) => it.time.start < Date.now());

    case `Future`:
      return points.filter((it) => it.time.start > Date.now());
  }
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

      renderPoints(filteredPoints(filterComponent._name, points));
    };

    if (filterComponent._checked) {
      filterComponent._onFilter();
    }
  });
};

const deleteEmptyPoints = (points) => {
  let pointsNew = [];
  for (let i = 0; i < points.length; i++) {
    if (points[i].id) {
      pointsNew.push(points[i]);
    }
  }
  return pointsNew;
};

const renderPoints = (points) => {
  tripDayElement.innerHTML = ``;

  for (let i = 0; i < points.length; i++) {
    if (points[i] !== {}) {
      const point = points[i];
      const pointComponent = new Point(point);
      const pointOpenComponent = new PointOpen(point, destinationsData, destinationsDict);

      tripDayElement.appendChild(pointComponent.render());

      pointComponent.onOpen = () => {
        pointOpenComponent.render();
        tripDayElement.replaceChild(pointOpenComponent.element, pointComponent.element);
        pointComponent.unrender();
      };

      pointOpenComponent.onSubmit = (newObject) => {
        pointOpenComponent.blockSave();
        point.type = newObject.type;
        point.offers = newObject.offers;
        if (newObject.time.start !== ``) {
          point.time.start = newObject.time.start;
        }
        if (newObject.time.end !== ``) {
          point.time.end = newObject.time.end;
        }
        point.price = newObject.price;
        point.destination = newObject.destination;

        api.updatePoint({id: point.id, data: point.toRAW()})
        .then((response) => {
          if (response) {
            pointComponent.update(response);
            pointComponent.render();
            tripDayElement.replaceChild(pointComponent.element, pointOpenComponent.element);
            pointOpenComponent.unrender();
          }
        })
        .catch(() => {
          pointOpenComponent.shake();
        })
        .then(() => {
          pointOpenComponent.unblockSave();
        });
      };

      pointOpenComponent.onDelete = ({id}) => {
        pointOpenComponent.blockDelete();

        api.deletePoint({id})
          .then(() => api.getPoints())
          .then((pointsNew) => {
            let pointsNew2 = deleteEmptyPoints(pointsNew);
            renderFilters(filtersData, pointsNew2);
          })
          .catch(() => {
            pointOpenComponent.shake();
            pointOpenComponent.unblockDelete();
          });
      };
    }
  }
};

const filtersData = [
  {id: `everything`, name: `Everything`, count: getRandom(maxPoints), checked: true},
  {id: `future`, name: `Future`, count: getRandom(maxPoints), checked: false},
  {id: `past`, name: `Past`, count: getRandom(maxPoints), checked: false}
];

const startLoadPoints = () => {
  tripDayElement.innerHTML = `Loading route...`;
};

const errorLoadPoints = () => {
  tripDayElement.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
};

const stopLoadPoints = () => {

};

api.getDestinations()
.then((destinations) => {
  destinationsData = destinations;
  destinations.forEach((it) =>{
    destinationsDict[it.name] = it;
  });
})
.catch();

api.getOffers()
.then((offers) => {
  offers.forEach((it) =>{
    offersDict[it.type] = it.offers.map((iit) => ({title: iit.name, price: iit.price, accepted: false}));
  });
});

startLoadPoints();

api.getPoints()
  .then((points) => {
    renderFilters(filtersData, points);
  })
  .then(stopLoadPoints)
  .catch(errorLoadPoints);

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
