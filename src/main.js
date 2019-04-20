import Point from './point.js';
import PointOpen from './point-open.js';
import Filter from './filter.js';
import Sorting from './sorting.js';
import {createMoneyChart, createTransportChart, createTimeSpendChart} from './statistik.js';
import API from './api.js';
import Provider from './provider.js';
import Store from './store.js';
import ModelPoint from './model-point.js';
import TotalCost from './total-cost.js';
import {travelWaysFirst, travelWaysSecond} from './common.js';

const mainElement = document.querySelector(`main`);
const tableLinkElement = document.querySelector(`.view-switch__item--table`);

const statsElement = document.querySelector(`#stats`);
const moneyCtx = document.querySelector(`.statistic__money`);
const transportCtx = document.querySelector(`.statistic__transport`);
const timeSpendCtx = document.querySelector(`.statistic__time-spend`);
const containerStatistic = document.querySelector(`.statistic`);
const statsLinkElement = document.querySelector(`.view-switch__item--stats`);

const tripFilterForm = document.querySelector(`.trip-filter`);
const tripDayElement = document.querySelector(`.trip-day__items`);
const newEventButton = document.querySelector(`.trip-controls__new-event`);
const totalCostElement = document.querySelector(`.trip__total`);
const tripSortingForm = document.querySelector(`.trip-sorting`);

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZA691`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip/`;
const ESC_KEYCODE = 27;

const storeKey = {
  'points': `points-store-key`,
  'destinations': `destinations-store-key`,
  'offers': `offers-store-key`,
};
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: storeKey, storage: localStorage});
const provider = new Provider({api, store, generateId: () => String(Date.now())});

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncPoints();
});

export const destinationsData = [];
export const destinationsDict = {};
export const offersDict = {};
let pointsArrayCurrent = [];

const totalCostComponent = new TotalCost(0);

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

const sortingPoints = (sortingName, points) => {
  switch (sortingName) {
    case `Event`:
      return points.sort((a, b) => a.id - b.id);

    case `Time`:
      return points.sort((a, b) => (a.time.end - a.time.start) - (b.time.end - b.time.start));

    case `Price`:
      return points.sort((a, b) => a.price - b.price);
  }
  return points;
};

const countCost = (points) => {
  let summ = 0;
  points.forEach((it)=>{
    summ += Number.parseInt(it.price, 10);
    [...it.offers].forEach((iit)=>{
      summ += Number.parseInt(iit.price, 10);
    });
  });
  return summ;
};

const countTime = (points) => {
  let summ = 0;
  points.forEach((it)=> {
    summ += it.time.end - it.time.start;
  });
  return summ;
};

// Для статистики по деньгам
const countMoneyCategory = (points) => {
  const types = [];
  const data = [];
  let dataObj = [];
  travelWaysFirst.forEach((it) => {
    const cost = countCost(points.filter((iit) => iit.type === it.name));
    if (cost > 0) {
      dataObj.push({type: `${it.icon} ${it.name}`, cost});
    }
  });

  travelWaysSecond.forEach((it) => {
    const cost = countCost(points.filter((iit) => iit.type === it.name));
    if (cost > 0) {
      dataObj.push({type: `${it.icon} ${it.name}`, cost});
    }
  });
  dataObj = dataObj.sort((a, b) => b.cost - a.cost);
  dataObj.forEach((it) => {
    data.push(it.cost);
    types.push(it.type);
  });

  return ({types, dataTypes: data});
};

// Для статистики по видам транспорта
const countTransportCategory = (points) => {
  const types = [];
  const data = [];
  let dataObj = [];
  travelWaysFirst.forEach((it) => {
    const transportPoints = points.filter((iit) => iit.type === it.name);
    const count = transportPoints.length;
    if (count > 0) {
      dataObj.push({type: `${it.icon} ${it.name}`, count});
    }
  });

  dataObj = dataObj.sort((a, b) => b.count - a.count);
  dataObj.forEach((it) => {
    data.push(it.count);
    types.push(it.type);
  });

  return ({types, dataTypes: data});
};

// Для статистики по затраченному времени
const countTimespendPoints = (points) => {
  const types = [];
  const data = [];
  let dataObj = [];
  travelWaysFirst.forEach((it) => {
    const time = countTime(points.filter((iit) => iit.type === it.name));
    if (time > 0) {
      dataObj.push({type: `${it.icon} ${it.name}`, time});
    }
  });

  travelWaysSecond.forEach((it) => {
    const time = countTime(points.filter((iit) => iit.type === it.name));
    if (time > 0) {
      dataObj.push({type: `${it.icon} ${it.name}`, time});
    }
  });
  dataObj = dataObj.sort((a, b) => b.time - a.time);
  dataObj.forEach((it) => {
    data.push(Math.floor(it.time / 3600000));
    types.push(it.type);
  });

  return ({types, dataTypes: data});
};

const renderFilters = (data, sortData, points) => {
  tripFilterForm.innerHTML = ``;
  totalCostElement.innerHTML = ``;
  totalCostElement.appendChild(totalCostComponent.render());

  data.forEach((filter) => {
    const filterComponent = new Filter(filter);
    tripFilterForm.appendChild(filterComponent.render());
    filterComponent.onFilter = () => {
      containerStatistic.classList.add(`visually-hidden`);
      mainElement.classList.remove(`visually-hidden`);
      renderSorting(sortData, filteredPoints(filterComponent._name, points));
    };

    if (filterComponent._checked) {
      filterComponent._onFilter();
    }
  });

  totalCostComponent.setCost = countCost(pointsArrayCurrent);
  totalCostComponent.unrender();
  totalCostElement.appendChild(totalCostComponent.render());
};

const renderSorting = (data, points) => {
  tripSortingForm.innerHTML = ``;

  data.forEach((sorting) => {
    const sortingComponent = new Sorting(sorting);

    tripSortingForm.appendChild(sortingComponent.render());
    sortingComponent.onSorting = () => {
      renderPoints(sortingPoints(sortingComponent._name, points));
    };

    if (sortingComponent._checked) {
      sortingComponent._onSorting();
    }
  });
};

const renderPoints = (points) => {
  tripDayElement.innerHTML = ``;

  points.forEach((point) => {
    if (point !== {}) {
      const pointComponent = new Point(point);
      const pointOpenComponent = new PointOpen(point, destinationsData, destinationsDict);

      tripDayElement.appendChild(pointComponent.render());

      const onPointOpenEscPress = (evt) => {
        if (evt.keyCode === ESC_KEYCODE) {
          pointComponent.render();
          tripDayElement.replaceChild(pointComponent.element, pointOpenComponent.element);
          pointOpenComponent.unrender();
          document.removeEventListener(`keydown`, onPointOpenEscPress);
        }
      };

      pointComponent.onOpen = () => {
        pointOpenComponent.render();
        tripDayElement.replaceChild(pointOpenComponent.element, pointComponent.element);
        pointComponent.unrender();
        document.addEventListener(`keydown`, onPointOpenEscPress);
      };

      pointOpenComponent.onSubmit = (newObject) => {
        pointOpenComponent.blockSave();
        point.type = newObject.type;

        point.offers = new Set([...pointOpenComponent._offers].map((it) => {
          if (([...newObject.offers].filter((obj) => ((obj.title === it.title) && (obj.price === it.price)))).length > 0) {
            return {title: it.title, price: it.price, accepted: true};
          } else {
            return {title: it.title, price: it.price, accepted: false};
          }
        }));

        if (newObject.time.start !== ``) {
          point.time.start = newObject.time.start;
        }
        if (newObject.time.end !== ``) {
          point.time.end = newObject.time.end;
        }
        point.price = newObject.price;
        point.destination = newObject.destination;
        point.isFavorite = newObject.isFavorite;
        document.removeEventListener(`keydown`, onPointOpenEscPress);

        provider.updatePoint({id: point.id, data: point.toRAW()})
        .then((response) => {
          if (response) {
            pointComponent.update(response);
            pointOpenComponent.update(response);
            pointComponent.render();
            tripDayElement.replaceChild(pointComponent.element, pointOpenComponent.element);
            pointOpenComponent.unrender();

            totalCostComponent.setCost = countCost(pointsArrayCurrent);
            totalCostComponent.unrender();
            totalCostElement.appendChild(totalCostComponent.render());
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
        document.removeEventListener(`keydown`, onPointOpenEscPress);

        provider.deletePoint({id})
          .then(() => provider.getPoints())
          .then((pointsNew) => {

            pointsArrayCurrent = pointsNew;
            totalCostComponent.setCost = countCost(pointsArrayCurrent);
            totalCostComponent.unrender();
            totalCostElement.appendChild(totalCostComponent.render());

            renderFilters(filtersData, sortingData, pointsNew);
          })
          .catch(() => {
            pointOpenComponent.shake();
            pointOpenComponent.unblockDelete();
          });
      };
    }
  });
};

const filtersData = [
  {id: `everything`, name: `Everything`, count: getRandom(maxPoints), checked: true},
  {id: `future`, name: `Future`, count: getRandom(maxPoints), checked: false},
  {id: `past`, name: `Past`, count: getRandom(maxPoints), checked: false}
];

const sortingData = [
  {id: `event`, name: `Event`, checked: true, active: true},
  {id: `time`, name: `Time`, checked: false, active: true},
  {id: `price`, name: `Price`, checked: false, active: true},
  {id: `offers`, name: `Offers`, checked: false, active: false}
];

const startLoadPoints = () => {
  tripDayElement.innerHTML = `Loading route...`;
};

const errorLoadPoints = () => {
  tripDayElement.innerHTML = `Something went wrong while loading your route info. Check your connection or try again later`;
};

const stopLoadPoints = () => {

};

provider.getDestinations()
.then((destinations) => {
  destinations.forEach((it) => {
    destinationsData.push(it);
    destinationsDict[it.name] = it;
  });
})
.catch();

provider.getOffers()
.then((offers) => {
  offers.forEach((it) =>{
    offersDict[it.type] = it.offers.map((iit) => ({title: iit.name, price: iit.price, accepted: false}));
  });
});

startLoadPoints();

provider.getPoints()
  .then((points) => {
    pointsArrayCurrent = points;
    renderFilters(filtersData, sortingData, points);
  })
  .then(stopLoadPoints)
  .catch(errorLoadPoints);


const onClickStatistic = function (evt) {
  evt.preventDefault();
  containerStatistic.classList.remove(`visually-hidden`);
  mainElement.classList.add(`visually-hidden`);
  tableLinkElement.classList.remove(`view-switch__item--active`);
  statsLinkElement.classList.add(`view-switch__item--active`);

  tripFilterForm.classList.add(`visually-hidden`);
  createMoneyChart(moneyCtx, countMoneyCategory(pointsArrayCurrent).types, countMoneyCategory(pointsArrayCurrent).dataTypes);
  createTransportChart(transportCtx, countTransportCategory(pointsArrayCurrent).types, countTransportCategory(pointsArrayCurrent).dataTypes);
  createTimeSpendChart(timeSpendCtx, countTimespendPoints(pointsArrayCurrent).types, countTimespendPoints(pointsArrayCurrent).dataTypes);
};

statsElement.addEventListener(`click`, onClickStatistic);

const onClickTable = function (evt) {
  evt.preventDefault();
  containerStatistic.classList.add(`visually-hidden`);
  tripFilterForm.classList.remove(`visually-hidden`);

  mainElement.classList.remove(`visually-hidden`);
  tableLinkElement.classList.add(`view-switch__item--active`);
  statsLinkElement.classList.remove(`view-switch__item--active`);
};
document.querySelector(`.view-switch__item`).addEventListener(`click`, onClickTable);

const onNewEventEscPress = (evt) => {
  if (evt.keyCode === ESC_KEYCODE) {
    renderFilters(filtersData, sortingData, pointsArrayCurrent);
    document.removeEventListener(`keydown`, onNewEventEscPress);
  }
};

const onClickNewEventButton = function () {
  const newPoint = new ModelPoint({
    'id': -1,
    'type': ``,
    'date_from': Date.now(),
    'date_to': Date.now() + 3600000,
    'offers': [],
    'base_price': 0,
    'destination': {name: ``, description: ``, pictures: []},
    'is_favorite': false,
  });

  const pointOpen = new PointOpen(newPoint);
  tripDayElement.insertBefore(pointOpen.render(), tripDayElement.firstElementChild);

  /* Создание новой точки */
  document.addEventListener(`keydown`, onNewEventEscPress);

  pointOpen.onSubmit = (newObject) => {
    if ((newObject.destination) && (newObject.type) && (newObject.price !== 0)) {
      pointOpen.blockSave();
      newPoint.type = newObject.type;

      const offersNew = (offersDict[newObject.type]) ? offersDict[newObject.type] : [];
      newPoint.offers = new Set([...offersNew].map((it) => {
        if (([...newObject.offers].filter((obj) => ((obj.title === it.title) && (obj.price === it.price)))).length > 0) {
          return {title: it.title, price: it.price, accepted: true};
        } else {
          return {title: it.title, price: it.price, accepted: false};
        }
      }));

      if (newObject.time.start !== ``) {
        newPoint.time.start = newObject.time.start;
      }
      if (newObject.time.end !== ``) {
        newPoint.time.end = newObject.time.end;
      }
      newPoint.price = newObject.price;
      newPoint.destination = newObject.destination;
      newPoint.isFavorite = newObject.isFavorite;

      const point = newPoint.toRAW();
      document.removeEventListener(`keydown`, onNewEventEscPress);
      provider.createPoint({point})
      .then((response) => {
        if (response) {
          provider.getPoints()
            .then((points) => {
              pointsArrayCurrent = points;
              renderFilters(filtersData, sortingData, points);
            })
            .then(stopLoadPoints)
            .catch(errorLoadPoints);
        }
      })
      .catch(() => {
        pointOpen.shake();
      })
      .then(() => {
        pointOpen.unblockSave();
      });
    } else {
      pointOpen.shake();
    }
  };

  pointOpen.onDelete = () => {
    renderFilters(filtersData, sortingData, pointsArrayCurrent);
    document.removeEventListener(`keydown`, onNewEventEscPress);
  };
};
newEventButton.addEventListener(`click`, onClickNewEventButton);
