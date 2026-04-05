import { formatDate } from '../utils.js';
import { getDuration } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createOfferTemplate(offers) {
  // title и price из offers.js
  return `${offers.map((offer) => (
    `<li class="event__offer">
      <span span class="event__offer-title">${offer.title}</span>&plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li > `)).join('')}`;
}

// передать точку, пункт назначения, предложения
function createPointTemplate(point, destination, offers) {
  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${formatDate(point.dateFrom, 'YYYY-MM-DD')}">${formatDate(point.dateFrom)}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon"> <!-- подстановка картинок-->
              </div>
              <h3 class="event__title">${point.type} ${destination.name}</h3> <!-- подстановка места путешествия-->
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${formatDate(point.dateFrom, 'YYYY-DD-MM[T]HH:mm')}">${formatDate(point.dateFrom, 'HH:mm')}</time><!--2019-03-18T10:30-->
                  &mdash;
                  <time class="event__end-time" datetime="${formatDate(point.dateTo, 'YYYY-DD-MM[T]HH:mm')}">${formatDate(point.dateTo, 'HH:mm')}</time>
                </p>
                <p class="event__duration">${getDuration(point.dateFrom, point.dateTo)}</p>
              </div><!--30M-->
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span> <!-- подстановка стоимости-->
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">

                ${createOfferTemplate(offers)} <!--offers-->

                </ul >
              <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button"> <!-- вместо event__favorite-btn--active -->
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div >
          </li > `;
}

export default class PointView extends AbstractView {
  constructor(point, destination, offers) {
    super(); // вызвать конструктор родителя
    this.point = point; // данные передаются из файла board-presenter.js
    this.destination = destination;
    this.offers = offers;

  }

  init({ onEditClick, onFavoriteClick }) {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', onEditClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', onFavoriteClick);
  }


  get template() {
    return createPointTemplate(this.point, this.destination, this.offers);
  }

}
