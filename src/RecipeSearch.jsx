import { useState } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard";
import RecipeSummary from "./RecipeSummary";
import "./App.css";

function RecipeSearch() {
	const [ingredients, setIngredients] = useState("");
	const [recipes, setRecipes] = useState([]);
	const [selectedRecipe, setSelectedRecipe] = useState(null); // State for the selected recipe summary
	const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

	const searchRecipes = async () => {
		try {
			const response = await axios.get(
				`https://api.spoonacular.com/recipes/findByIngredients`,
				{
					params: {
						// Ingredients need to be a comma-separated string
						ingredients: ingredients
							.split(",")
							.map((ingredient) => ingredient.trim())
							.join(","),
						number: 3, // Limit the number of results
						apiKey: apiKey,
					},
				}
			);
			setRecipes(response.data);
			console.log(response.data);
		} catch (e) {
			console.error(e);
		}
	};

	// Function to get recipe details and store in state for summary display
	const fetchRecipeDetails = async (recipeId) => {
		try {
			const response = await axios.get(
				`https://api.spoonacular.com/recipes/${recipeId}/information`,
				{
					params: {
						apiKey: apiKey,
					},
				}
			);
			console.log(response.data);
			return response.data; // Return the response data
		} catch (e) {
			console.error(e);
			return null; // Return null in case of error
		}
	};

	// Function to get recipe summary
	const getRecipeSummary = async (recipeId) => {
		const recipeDetails = await fetchRecipeDetails(recipeId);
		if (recipeDetails) {
			setSelectedRecipe(recipeDetails); // Update selected recipe state
		}
	};

	// Function to open recipe in new tab
	const getRecipeDetails = async (recipeId) => {
		const recipeDetails = await fetchRecipeDetails(recipeId);
		if (recipeDetails) {
			window.open(recipeDetails.sourceUrl, "_blank");
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setSelectedRecipe(null); // Clear the selected recipe summary
		if (ingredients) {
			searchRecipes();
		}
	};

	return (
		<div className="recipe-search-container">
			<h1>What can I make for dinner if I have...</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="apples, flour, sugar"
					value={ingredients}
					onChange={(e) => setIngredients(e.target.value)}
				/>
				<button type="submit">Search</button>
			</form>

			<div className="summary-and-recipes">
				{/* Section to show the selected recipe summary */}
				{selectedRecipe && <RecipeSummary recipe={selectedRecipe} />}

				<div className="recipe-collection">
					<h2>Recipes:</h2>
					<div className="cards-container">
						{recipes.map((recipe) => (
							<RecipeCard
								key={recipe.id}
								recipe={recipe}
								onViewSummary={getRecipeSummary}
								onViewRecipe={getRecipeDetails}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default RecipeSearch;

// features to add next
