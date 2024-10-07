// RecipeSummary.js
import React from "react";

const RecipeSummary = ({ recipe }) => {
	return (
		<div className="recipe-summary">
			<h2>{recipe.title}</h2>
			<img src={recipe.image} alt={recipe.title} />
			<p>
				<strong>Summary:</strong>{" "}
				{recipe.summary.replace(/<[^>]*>?/gm, "")}
			</p>
			<p>
				<strong>Servings:</strong> {recipe.servings}
			</p>
			<p>
				<strong>Ready in:</strong> {recipe.readyInMinutes} minutes
			</p>
			<p>
				<strong>Source:</strong>{" "}
				<a
					href={recipe.sourceUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					Click here for full recipe
				</a>
			</p>
		</div>
	);
};

export default RecipeSummary;
