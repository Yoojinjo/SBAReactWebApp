import { useState } from "react";
import axios from "axios";

function RecipeSearch() {
	const [ingredients, setIngredients] = useState("");
	const [recipes, setRecipes] = useState([]);
	const apiKey = "Placeholder for Spoonacular API";

	const searchRecipes = async () => {
		try {
			const response = await axios.get(
				`https://api.spoonacular.com/recipes/findByIngredients`,
				{
					params: {
						ingredients, // Ingredients to search for
						number: 3, // Limit the number of results
						apiKey: apiKey,
					},
				}
			);
			setRecipes(response.data);
		} catch (e) {
			error.log(e);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<div>
			<h1>Search Recipes by Ingredients</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Enter ingredients, e.g. apples, flour, sugar"
					value={ingredients}
					onChange={(e) => setIngredients(e.target.value)}
				/>
				<button type="submit">Search</button>
			</form>
		</div>
	);
}
export default RecipeSearch;
