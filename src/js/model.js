import { async } from "regenerator-runtime";
import { RES_PER_PAGE, API_URL, KEY } from "./config";
import { AJAX } from "./helpers";
("./helpers");

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    source: recipe.source_url,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (recipeId) {
  try {
    const data = await AJAX(`${API_URL}/${recipeId}?key=${KEY}`);

    createRecipeObject(data);

    state.recipe.isBookmarked = false;

    if (state.bookmarks.some((bookmark) => bookmark.id === recipeId))
      state.recipe.isBookmarked = true;
  } catch (err) {
    console.error(err);

    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(err);

    throw err;
  }
};

export const getSearchResultsPage = function (
  page = state.search.page
) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity =
      (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const presistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  state.recipe.isBookmarked = true;

  presistBookmarks();
};

export const removeBookmark = function (recipeId) {
  const index = state.bookmarks.findIndex(
    (bookmark) => bookmark.id === recipeId
  );

  state.bookmarks.splice(index, 1);

  state.recipe.isBookmarked = false;

  presistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        (entrie) =>
          entrie[0].startsWith("ingredient") && entrie[1] !== ""
      )
      .map(([_, ing]) => {
        const ingArr = ing.split(",").map((ing) => ing.trim());

        if (ingArr.length !== 3)
          throw new Error("wrong ingredients format");

        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      servings: +newRecipe.servings,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    createRecipeObject(data);
    addBookmark(state.recipe);
    // console.log(data);
    // console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");

  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
