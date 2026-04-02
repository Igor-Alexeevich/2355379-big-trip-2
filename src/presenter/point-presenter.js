import { replace, render, remove } from '../framework/render.js';

import PointView from '../view/point-view.js';

import EditPointView from '../view/edit-point-view.js';

export default class PointPresenter {
  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #pointsModel = null;
  #listPoint = null;

  constructor(point, pointsModel, listPoint) {
    this.#point = point;
    this.#pointsModel = pointsModel;
    this.#listPoint = listPoint;
  }

  init() {
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    // у очередного элемента по destination находим в points-model.js с функцией getDestinationById,
    const destination = this.#pointsModel.getDestinationById(this.#point.destination);
    // как в const point
    const offers = this.#pointsModel
      .getOffersByType(this.#point.type)
      .offers // массив 'offers': по типу в offers.js
      .filter((offer) => this.#point.offers.includes(offer.id)); // фильтрация id-шников в 'offers': в points.js

    const allDestinations = this.#pointsModel.getDestination().map((item) => item.name);
    const allTypes = this.#pointsModel.getOffers().map((item) => item.type);
    const offersByType = this.#pointsModel.getOffersByType(this.#point.type).offers;


    this.#pointComponent = new PointView(this.#point, destination, offers);
    this.#pointComponent.init({
      onEditClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      }
    });

    this.#pointEditComponent = new EditPointView(this.#point, destination, allDestinations, allTypes, offersByType);

    this.#pointEditComponent.init({
      onCancelClick: () => {
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      }
    });
    render(this.#pointComponent, this.#listPoint.element);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#listPoint.element);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#listPoint.element.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#listPoint.element.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

}
