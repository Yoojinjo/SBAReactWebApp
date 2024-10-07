import { useState } from "react";
import axios from "axios";
import "./App.css";

function RecipeSearch() {
	const [ingredients, setIngredients] = useState("");
	const [recipes, setRecipes] = useState([]);
	const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

	const searchRecipes = async () => {
		try {
			const response = await axios.get(
				`https://api.spoonacular.com/recipes/findByIngredients`,
				{
					params: {
						//ingredients need to be a comma separated string
						ingredients: ingredients
							.split(",")
							.map((ingredient) => ingredient.trim())
							.join(","),
						number: 9, // Limit the number of results
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

	const handleSubmit = (e) => {
		e.preventDefault();
		if (ingredients) {
			searchRecipes();
		}
	};

	return (
		<div>
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

			<h2>Recipes:</h2>

			<div className="recipe-cards">
				{recipes.map((recipe) => (
					<div className="recipe-card" key={recipe.id}>
						<h3>{recipe.title}</h3>
						<img src={recipe.image} alt={recipe.title} />
						{/* <p>I have: {recipe.usedIngredients[0].originalName}</p> */}
						{/* Map used ingredients */}
						<h5>I have:</h5>
						<ul>
							{recipe.usedIngredients.map((ingredient) => (
								<li key={ingredient.id}>
									{ingredient.originalName}
								</li>
							))}
						</ul>

						{/* <p>
							I need: {recipe.missedIngredients[0].originalName}
						</p> */}
						{/* Map missed ingredients */}
						<h5>I also need:</h5>
						<ul>
							{recipe.missedIngredients.map((ingredient) => (
								<li key={ingredient.id}>
									{ingredient.originalName}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
export default RecipeSearch;

// features to add next
// Display the recipe instructions when a card is clicked.
// Add a state for the selected recipe id.
// Create a function to fetch recipe details.
// redirect to source url?
