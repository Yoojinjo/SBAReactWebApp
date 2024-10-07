import { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard";
import RecipeSummary from "./RecipeSummary";
import "./App.css";

function RecipeSearch() {
	const [ingredients, setIngredients] = useState("");
	const [recipes, setRecipes] = useState([]);
	const [selectedRecipe, setSelectedRecipe] = useState(null); // State for the selected recipe summary
	const [favorites, setFavorites] = useState([]);
	const [isSidebarVisible, setIsSidebarVisible] = useState(false);

	const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

	useEffect(() => {
		const savedFavorites = localStorage.getItem("favorites");
		if (savedFavorites) {
			// console.log("Loaded Favorites:", JSON.parse(savedFavorites));
			setFavorites(JSON.parse(savedFavorites));
		}
	}, []);

	const toggleFavorite = async (recipe) => {
		// Ensure we get the complete recipe details, including sourceUrl
		const recipeDetails = await fetchRecipeDetails(recipe.id);

		if (recipeDetails) {
			setFavorites((prevFavorites) => {
				const updatedFavorites = prevFavorites.find(
					(fav) => fav.id === recipe.id
				)
					? prevFavorites.filter((fav) => fav.id !== recipe.id) // Remove if already a favorite
					: [...prevFavorites, recipeDetails]; // Add full recipe details

				// Save updated favorites to local storage
				localStorage.setItem(
					"favorites",
					JSON.stringify(updatedFavorites)
				);
				return updatedFavorites;
			});
		}
	};
	const toggleSidebar = () => {
		setIsSidebarVisible((prev) => !prev);
	};

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
			{/* Main Content */}
			<div className="main-content">
				<h1>What can I make for dinner if I have...</h1>
				<button
					onClick={toggleSidebar}
					style={{
						backgroundColor: isSidebarVisible
							? "#FA8096"
							: "#E62D68",
					}}
				>
					{isSidebarVisible ? "Hide Favorites" : "Show Favorites"}
				</button>
				<form onSubmit={handleSubmit}>
					<p>enter ingredients separated by commas</p>
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
						<RecipeSummary recipe={selectedRecipe} />
					)}

					<div className="recipe-collection">
						<h2>Recipes:</h2>
						<div className="cards-container">
							{recipes.map((recipe) => (
								<RecipeCard
									key={recipe.id}
									recipe={recipe}
									onViewSummary={getRecipeSummary}
									onViewRecipe={getRecipeDetails}
									onToggleFavorite={toggleFavorite}
									isFavorite={favorites.some(
										(fav) => fav.id === recipe.id // Check if a favorite
									)}
								/>
							))}
						</div>
					</div>
				</div>
				<div className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
					<h2>Favorite Recipes</h2>
					<ul>
						{favorites.map((fav) => {
							// console.log(fav.sourceUrl);
							return (
								<li key={fav.id}>
									<a
										href={fav.sourceUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										{fav.title}
									</a>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default RecipeSearch;

// features to add next
