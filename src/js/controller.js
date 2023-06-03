import "core-js/stable";
import "regenerator-runtime/runtime";
import { MODEL_CLOSE_SEC } from "./config";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

///////////////////////////////////////
const controleRecipes = async function () {
  try {
    const recipeId = window.location.hash.slice(1);

    if (!recipeId) return;

    recipeView.renderSpinner();

    // 0. marck the selected recipe in the results tab
    resultsView.update(model.getSearchResultsPage());

    // 0. marck the selected recipe in the bookmarks tab
    bookmarksView.update(model.state.bookmarks);

    // 1. getting the recipe
    await model.loadRecipe(recipeId);

    // 2. rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controleSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();

    if (!query) return;

    await model.loadSearchResults(query);

    if (model.state.search.results.length === 0)
      throw new Error("no search results found");

    resultsView.render(model.getSearchResultsPage(1));

    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controleSearchPagination = function (page) {
  resultsView.render(model.getSearchResultsPage(page));

  paginationView.render(model.state.search);
};

const controleServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controleBookmark = function () {
  if (model.state.recipe.isBookmarked) {
    model.removeBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

const controleBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controleAddRecipe = async function (newRecipe) {
  addRecipeView.renderSpinner();

  try {
    await model.uploadRecipe(newRecipe);

    // render success message
    addRecipeView.renderMessage();

    // render ower recipe
    recipeView.render(model.state.recipe);

    // render the new recipe in the bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // adding the new recipe id to the url without reloading the page
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
    // hide the form
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controleBookmarks);
  recipeView.addHandlerRender(controleRecipes);
  recipeView.addHandlerServings(controleServings);
  recipeView.addHandlerBookmarks(controleBookmark);
  searchView.addHandlerSearch(controleSearchResults);
  paginationView.addHandlerPagination(controleSearchPagination);
  addRecipeView.addHandlerUpload(controleAddRecipe);
};
init();
