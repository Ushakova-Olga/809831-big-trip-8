import makeFilter from './make-filter.js';
import makePoint from './make-point.js';

const tripFilterForm = document.querySelector(`.trip-filter`);
const tripDayElement = document.querySelector(`.trip-day__items`);
const maxPoints = 10;

const getRandom = (count) => Math.floor(count * Math.random());

const renderTemplate = (template = ``) => {
  const templateElement = document.createElement(`template`);
  templateElement.innerHTML = template;
  return templateElement.content;
};

const renderPoints = (count) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    fragment.appendChild(renderTemplate(makePoint()));
  }
  tripDayElement.innerHTML = ``;
  tripDayElement.appendChild(fragment);
};

const filtersData = [
  {name: `Everything`, count: 0},
  {name: `Future`, count: 0},
  {name: `Past`, count: 0},
];

const createCountfiltersData = (data) => {
  data.forEach((filter) => {
    filter.count = getRandom(maxPoints);
  });
};

createCountfiltersData(filtersData);

const renderFilter = (data) => {
  const id = data.name.toLocaleLowerCase();

  const fragment = renderTemplate(makeFilter(id, data.name));
  const input = fragment.querySelector(`input`);
  input.addEventListener(`change`, () => renderPoints(data.count));
  return fragment;
};

const renderFilters = (data) => {
  const fragment = document.createDocumentFragment();
  data.forEach((filter) => fragment.appendChild(renderFilter(filter)));
  tripFilterForm.innerHTML = ``;
  tripFilterForm.appendChild(fragment);
};

renderFilters(filtersData);
