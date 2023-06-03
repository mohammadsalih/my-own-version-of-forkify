import icons from "../../img/icons.svg";
import view from "./view.js";

class AddRecipeView extends view {
  _parentElement = document.querySelector(".upload");

  _overlayElement = document.querySelector(".overlay");
  _windowElement = document.querySelector(".add-recipe-window");

  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  _Message = "the recipe was addied successfully ";

  constructor() {
    super();

    this._addHandlerToggleWindow();
  }

  _generateMarkup() {}

  toggleWindow() {
    this._overlayElement.classList.toggle("hidden");
    this._windowElement.classList.toggle("hidden");
  }

  _addHandlerToggleWindow() {
    this._btnOpen.addEventListener(
      "click",
      this.toggleWindow.bind(this)
    );
    this._btnClose.addEventListener(
      "click",
      this.toggleWindow.bind(this)
    );
    this._overlayElement.addEventListener(
      "click",
      this.toggleWindow.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (event) {
      event.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }
}

export default new AddRecipeView();
