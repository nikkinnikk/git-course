import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipieView from './views/addRecipieView.js';
import {TIMER_CLOSE_SEC} from './config.js'
import {Fraction} from 'fractional';


// if(module.hot) {
// 	module.hot.accept()
// }

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////


// 1) LOADING RECIEPE //////////////////////////////////////////////////////////////////////

async function conrtolRecipes() {
	try {
		const id = window.location.hash.slice(1);
		// console.log(id);

		if (!id) return;
		recipeView.renderSpinner();

		resultsView.update(model.getSearchResultPage())

		await model.loadRecipe(id);
		const {recipe} =  model.state;
		///// 2)  RENDER RECEPI /////////////////////////////////////////////////////////////
		recipeView.render(model.state.recipe);

		controlServings();
	} catch(err) {
		// alert(`${err} @@@@@`);
		recipeView.renderError();
	}	
};

async function controlSearchResult() {
	try {
		resultsView.renderSpinner();
		console.log(recipeView);
		// 1) Get search query //
		const query = searchView.getQuery();
		if(!query) return
		// 2) Load search result //
		await model.loadSearchRecepie(query);
		// 3) Render result //
		
		resultsView.render(model.getSearchResultPage(1));
		// console.log(model.state.search.results);

		// 4) Render initial pagination buttons////

		paginationView.render(model.state.search)
	} catch(err) {
		console.log(err);
	}
}
// controlSearchResult();

function controlPaginator(adToPage) {
	console.log(adToPage);
	// 1) Render new result
	resultsView.render(model.getSearchResultPage(adToPage));
	//2) Rendwr new pagination buttons
	paginationView.render(model.state.search)
}

function controlServings() {
	model.UpdateServings(8);

	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
	if(!model.state.recipe.bookmarked) {
		model.addBoormark(model.state.recipe);
	

	}else {
		model.deletedBookmark(model.state.recipe.id);
	}

	console.log(model.state.recipe);
	recipeView.update(model.state.recipe)
	
}

async function controlAddRecepie(newRecepie) {
	try{
		//add Spinner
		addRecipieView.renderSpinner();

		//Upload new recepie
		await model.uploadRecepie(newRecepie);
		console.log(model.state.recipe);

		//Render recepie
		recipeView.render(model.state.recipe);

		// Sucses message 
		addRecipieView.renderMassage();

		// Render bookmark view
		// bookmarksView.ewbder(model.state.bookmark)

		// Change id in history

		window.history.pushState(null, '', `#${model.state.recipe.id}`)

		// Close window
		setTimeout(function() {
			addRecipieView.toggleWindow()
		}, TIMER_CLOSE_SEC * 1000);
		


	} catch(err) {
		addRecipieView.renderError(err);
		console.error('@', err)
		
	}
	
}



function init() {
	recipeView.addHandlerRender(conrtolRecipes);
	recipeView.addHandlerUpdateService(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResult);
	paginationView.addHandlerClick(controlPaginator);
	addRecipieView.addHandlerUpload(controlAddRecepie);
	// conrtolRecipes();
}
init();
// window.addEventListener('hashchange', conrtolRecipes);
// window.addEventListener('load', conrtolRecipes);









