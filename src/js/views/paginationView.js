import icons from "../../img/icons.svg";
import view from "./view.js";

class PaginationView extends view {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const pagesNum = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const pagesCurrent = this._data.page;

    // page 1 , and there are other pages
    if (pagesCurrent === 1 && pagesNum > 1)
      return `
          <button class="btn--inline pagination__btn--next">
            <span>Page 2</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;

    // other page
    if (pagesCurrent < pagesNum)
      return `
          <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${pagesCurrent - 1}</span>
          </button>

          <button class="btn--inline pagination__btn--next">
            <span>Page ${pagesCurrent + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;

    // last page
    if (pagesCurrent === pagesNum && pagesNum > 1)
      return `
          <button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${pagesCurrent - 1}</span>
          </button>
      `;

    return ``;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest("button");

      if (!btn) return;

      const pageNum = btn.classList.contains("pagination__btn--prev")
        ? --this._data.page
        : ++this._data.page;

      handler(pageNum);
    });
  }
}

export default new PaginationView();
