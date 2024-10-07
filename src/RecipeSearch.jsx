import { useState } from "react";
import axios from "axios";
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
				{selectedRecipe && (
					<div className="recipe-summary">
						<h2>{selectedRecipe.title}</h2>
						<img
							src={selectedRecipe.image}
							alt={selectedRecipe.title}
						/>
						<p>
							<strong>Summary:</strong>{" "}
							{selectedRecipe.summary.replace(/<[^>]*>?/gm, "")}
						</p>
						<p>
							<strong>Servings:</strong> {selectedRecipe.servings}
						</p>
						<p>
							<strong>Ready in:</strong>{" "}
							{selectedRecipe.readyInMinutes} minutes
						</p>
						<p>
							<strong>Source:</strong>{" "}
							<a
								href={selectedRecipe.sourceUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Click here for full recipe
							</a>
						</p>
					</div>
				)}

				<div className="recipe-collection">
					<h2>Recipes:</h2> 
					<div className="cards-container">
						{recipes.map((recipe) => (
							<div className="recipe-card" key={recipe.id}>
								<h3>{recipe.title}</h3>
								<img src={recipe.image} alt={recipe.title} />
								<h5>I have:</h5>
								<ul>
									{recipe.usedIngredients.map(
										(ingredient) => (
											<li key={ingredient.id}>
												{ingredient.originalName}
											</li>
										)
									)}
								</ul>

								<h5>I also need:</h5>
								<ul>
									{recipe.missedIngredients.map(
										(ingredient) => (
											<li key={ingredient.id}>
												{ingredient.originalName}
											</li>
										)
									)}
								</ul>

								<button
									onClick={() => getRecipeSummary(recipe.id)}
								>
									View Recipe Summary
								</button>
								<button
									onClick={() => getRecipeDetails(recipe.id)}
								>
									View Recipe
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default RecipeSearch;

// features to add next
// Display the recipe instructions when a card is clicked.
// Add a state for the selected recipe id.
// Create a function to fetch recipe details.
// Redirect to source URL?
