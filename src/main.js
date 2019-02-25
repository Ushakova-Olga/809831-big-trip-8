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
  {id: `everything`, name: `Everything`, count: getRandom(maxPoints), checked: true},
  {id: `future`, name: `Future`, count: getRandom(maxPoints)},
  {id: `past`, name: `Past`, count: getRandom(maxPoints)}
];

const renderFilter = (data) => {
  const checked = data.checked ? `checked` : ``;
  const fragment = renderTemplate(makeFilter(data, checked));
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
