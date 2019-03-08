export function renderOffers(offers) {
  return [...offers].map((it) => `
  <li>
    <button class="trip-point__offer">${it.name}+&euro;&nbsp;${it.cost}</button>
  </li>
  `).join(``);
}

export function createElement(template) {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
}
