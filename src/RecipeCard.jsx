// RecipeCard.js
import React from "react";

const RecipeCard = ({
	recipe,
	onViewSummary,
	onViewRecipe,
	onToggleFavorite,
	isFavorite,
}) => {
	return (
		<div className="recipe-card">
			<h3>{recipe.title}</h3>
			<img src={recipe.image} alt={recipe.title} />
			<h5>I have:</h5>
			<ul>
				{recipe.usedIngredients.map((ingredient) => (
					<li key={ingredient.id}>{ingredient.originalName}</li>
				))}
			</ul>

			<h5>I also need:</h5>
			<ul>
				{recipe.missedIngredients.map((ingredient) => (
					<li key={ingredient.id}>{ingredient.originalName}</li>
				))}
			</ul>

			<button onClick={() => onViewSummary(recipe.id)}>
				View Recipe Summary
			</button>
			<button onClick={() => onViewRecipe(recipe.id)}>View Recipe</button>
			<button
				onClick={() => onToggleFavorite(recipe)}
				style={{ backgroundColor: isFavorite ? "red" : "black" }} // Change button color
			>
				{isFavorite ? "Favorited" : "Save to Favorites"}
			</button>
		</div>
	);
};

export default RecipeCard;
