import {API_URL} from './config';
// import {getJson, sendJson} from './helpers';
import {AJAX} from './helpers';
import {RES_PER_PAGE, KEY} from './config';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE
    },
    bookmark: []
};

function creatRecepieObject(data) {
    const {recipe} = data.data;
    return {
        id: recipe.id,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        publisher: recipe.publisher,
        servings: recipe.servings,
        sourceUrl: recipe.source_url,
        title: recipe.title,
        imageUrl: recipe.image_url,
        ...(recipe.key && {key: recipe.key})
    };
}

export const loadRecipe = async function(id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        
        state.recipe = creatRecepieObject(data);

        if(state.bookmark.some(b => b.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
        // console.log(state.recipe);
    } catch(err) {
        throw err;
    }   
};

export const loadSearchRecepie = async function(query) {
    try {
        state.search.query = query;

        const data = await  AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        // console.log(data);

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                publisher: recipe.publisher,
                title: recipe.title,
                imageUrl: recipe.image_url,
                ...(recipe.key && {key: recipe.key})
            };
        });
        state.search.page = 1;
    } catch(err) {
        console.log(`${err} @@@`);
        throw err;
    }
};

export function  getSearchResultPage(page = state.search.page) {
    state.search.page = page

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

// console.log(state.search.results);

export function  UpdateServings(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

export function addBoormark(recipe) {
    //Add bookmark
    state.bookmark.push(recipe);

    // Mark current recepie as bookmark

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
}

export function deletedBookmark(id) {
    const index = state.bookmark.findIndex(el => el.id === id)
    state.bookmark.slice(index, 1);

    if(id === state.recipe.id) state.recipe.bookmarked = true;
}

export async function uploadRecepie(newRecepie) {
    try{
        const ingredients = Object.entries(newRecepie).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {

            const ingArr = ing[1].split(',').map(el => el.trim());

            if(ingArr.length !== 3) throw new Error('Wrong ingrodients format. Please use the correct format.');
    
            const [quantity, unit, description] =  ingArr

            return{quantity: quantity ? +quantity : null , unit, description}
        })
        
        const recipe = {
            cooking_time: +newRecepie.cookingTime,
            ingredients,
            publisher: newRecepie.publisher,
            servings: +newRecepie.servings,
            source_url: newRecepie.sourceUrl,
            title: newRecepie.title,
            image_url: newRecepie.image
        }
        console.log(recipe);


       const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
       state.recipe = creatRecepieObject(data);
       addBoormark(state.recipe);
       console.log(data);
    } catch(err) {
        throw err;
    }

   
    
}
