export default (data, checked = false) =>
  `
  <input type="radio" id="filter-${data.id}" name="filter" value="${data.id}" ${checked ? `checked` : ``}>
  <label class="trip-filter__item" for="filter-${data.id}">${data.name}</label>  `;
