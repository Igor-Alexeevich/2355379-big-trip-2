// 4.1.4. Добавит классам приватные поля и геттеры 13:35

// модель точек, отвечает за данные
import { offers } from '../data/offers.js';
import { points } from '../data/points.js';
import { destinations } from '../data/destinations.js';

export default class PointsModel {
  points = [];
  offers = [];
  destinations = [];

  constructor() {
    this.points = points;
    this.destinations = destinations;
    this.offers = offers;
  }

  getPoints() {
    return this.points;
  }

  getDestination() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  // найти пункт назначения в descriptions.js по id в board-presenter.js
  getDestinationById(id) {
    // внутри массива this.destinations находим один, в котором функция ищет указанный id
    return this.destinations.find((item) => item.id === id);
  }

  getDestinationByName(name) {
    // внутри массива this.destinations находим один, в котором функция ищет указанный name
    return this.destinations.find((item) => item.name === name);
  }

  // найти offers по типу
  getOffersByType(type) {
    return this.offers.find((item) => item.type === type);
  }
}
