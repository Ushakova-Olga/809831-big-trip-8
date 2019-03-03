const renderOffers = (offers) => {
  return [...offers].map((it) => `
  <li>
    <button class="trip-point__offer">${it.name}+&euro;&nbsp;${it.cost}</button>
  </li>
  `).join(``);
};

export default (point) =>
  `<article class="trip-point">
    <i class="trip-icon">${point.type.icon}</i>
    <h3 class="trip-point__title">${point.type.name} to ${point.city}</h3>
    <p class="trip-point__schedule">
      <span class="trip-point__timetable">${point.time.start}&nbsp;&mdash; ${point.time.end}</span>
      <span class="trip-point__duration">${point.duration}</span>
    </p>
    <p class="trip-point__price">&euro;&nbsp;${point.price}</p>
    <ul class="trip-point__offers">
      ${renderOffers(point.offers)}
    </ul>
  </article>`;
