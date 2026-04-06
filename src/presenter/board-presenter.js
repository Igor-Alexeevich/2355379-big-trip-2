import { render } from '../framework/render.js';
import BoardView from '../view/board.js'; // без скобок - импорт default, название может быть любое или повторяет с импорта
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

import SortView from '../view/sort-view.js';

import MessageView from '../view/message-view.js';
import PointPresenter from './point-presenter.js';

import { updateItem, sortPointsByPrice, SortType, sortPointsByDay, sortPointsByDuration } from '../utils.js';

export default class BoardPresenter {
  #listPoint = new BoardView();
  pointComponent = new PointView();
  editPointComponent = new EditPointView();
  messageComponent = new MessageView();
  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DEFAULT;

  constructor({ boardContainer, pointsModel }) { // параметр передан в main.js
    this.boardContainer = boardContainer; // создано свойство boardContainer у этого объекта
    this.pointsModel = pointsModel;
  }

  // init(), инициализатор начальной загрузки, название придумал
  // вызывается в main.js
  init() {
    this.points = this.pointsModel.getPoints().slice();

    // добавить сортировку
    this.#renderSort();
    // добавить список
    render(this.#listPoint, this.boardContainer);
    this.#renderPointList();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    // - Сортируем точки
    if (sortType === SortType.PRICE) {
      this.points = this.pointsModel.getPoints().slice().sort(sortPointsByPrice);
    }

    if (sortType === SortType.TIME) {
      this.points = this.pointsModel.getPoints().slice().sort(sortPointsByDuration);
    }

    if (sortType === SortType.DEFAULT) {
      this.points = this.pointsModel.getPoints().slice().sort(sortPointsByDay);
    }

    // - Очищаем список
    this.#clearPointList();

    // - Рендерим список заново
    this.#renderPointList();
  };

  #renderSort() {
    this.#sortComponent = new SortView();
    render(this.#sortComponent, this.boardContainer); // по умолчанию идет добавление в конец контейнера, прописано в render.js (place = RenderPosition.BEFOREEND)
    this.#sortComponent.init(this.#handleSortTypeChange);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.points = updateItem(this.points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

  }

  #renderPointList() {

    // проверить наличие точек и вывести сообщение
    if (this.points.length === 0) {
      render(this.messageComponent, this.boardContainer);
    } else {
      // добавить точки маршрута
      for (let i = 0; i < this.points.length; i++) {
        this.#renderPoint(this.points[i]);
      }
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      point,
      pointsModel: this.pointsModel,
      listPoint: this.#listPoint,
      handlePointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}

