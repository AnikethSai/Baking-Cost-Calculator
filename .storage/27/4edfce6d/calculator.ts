import { Ingredient, Recipe } from '@/lib/types';

export function calculateIngredientCost(ingredient: Ingredient): number {
  // Calculate cost based on the ratio of used quantity to purchase quantity
  // Assuming units are consistent
  const unitCost = ingredient.purchasePrice / ingredient.purchaseQuantity;
  return unitCost * ingredient.usedQuantity;
}

export function calculateTotalCost(ingredients: Ingredient[]): number {
  return ingredients.reduce((sum, ingredient) => sum + ingredient.cost, 0);
}

export function calculateCostPerUnit(totalCost: number, totalUnits: number): number {
  if (totalUnits <= 0) return 0;
  return totalCost / totalUnits;
}

export function updateRecipeCalculations(recipe: Recipe): Recipe {
  // Update cost for each ingredient
  const updatedIngredients = recipe.ingredients.map(ingredient => ({
    ...ingredient,
    cost: calculateIngredientCost(ingredient)
  }));

  // Calculate total cost
  const totalCost = calculateTotalCost(updatedIngredients);

  // Calculate cost per unit
  const costPerUnit = calculateCostPerUnit(totalCost, recipe.totalUnits);

  return {
    ...recipe,
    ingredients: updatedIngredients,
    totalCost,
    costPerUnit
  };
}