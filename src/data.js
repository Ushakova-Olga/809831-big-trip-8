// data.js

const getType = () => ([
  {name: `Taxi`, icon: `🚕`},
  {name: `Bus`, icon: `🚌`},
  {name: `Train`, icon: `🚂`},
  {name: `Ship`, icon: `🛳`},
  {name: `Transport`, icon: `🚊`},
  {name: `Drive`, icon: `🚗`},
  {name: `Flight`, icon: `✈️`},
  {name: `Check-in`, icon: `🏨`},
  {name: `Sightseeing`, icon: `🏛`},
  {name: `Restaurant`, icon: `🍴`},
][Math.floor(Math.random() * 10)]);

const getPrice = () => (10 * Math.floor(1 + Math.random() * 5));

const offers = [{name: `Add luggage`, cost: getPrice()},
  {name: `Switch to comfort class`, cost: getPrice()},
  {name: `Add meal`, cost: getPrice()},
  {name: `Choose seats`, cost: getPrice()},
];

const getCity = () => ([
  `Amsterdam`,
  `Paris`,
  `Saint-Petersburg`,
  `Geneva`,
  `London`,
  `Krasnojarsk`,
][Math.floor(Math.random() * 4)]);

const description = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`];

const getOffersSet = (offersArray) => {
  const result = [...new Set([
    offersArray[Math.floor(Math.random() * offersArray.length)],
    offersArray[Math.floor(Math.random() * offersArray.length)]
  ])];
  return result;
};

const getDescription = (descriptionArray) => {
  const off = new Set([
    descriptionArray[Math.floor(Math.random() * descriptionArray.length)],
    descriptionArray[Math.floor(Math.random() * descriptionArray.length)],
    descriptionArray[Math.floor(Math.random() * descriptionArray.length)],
  ]);

  return [...off].join();
};

const getTime = () => {
  const timeStart = Math.floor(Math.random() * 24);
  const timeEnd = timeStart + 1;
  return {start: timeStart + `:00`, end: timeEnd + `:00`};
};

const getDuration = () => ([
  `30 M`,
  `1H`,
  `1H 30M`,
  `2H`,
][Math.floor(Math.random() * 4)]);

const getDay = () => {
  return (Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000);
};

export default () => ({
  day: getDay(),
  type: getType(),
  city: getCity(),
  picture: `//picsum.photos/100/100?r=${Math.random()}`,
  offers: getOffersSet(offers),
  time: getTime(),
  price: getPrice(),
  duration: getDuration(),
  description: getDescription(description),
});
