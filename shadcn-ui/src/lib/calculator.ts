import { Ingredient, Recipe } from '@/lib/types';

export function calculateIngredientCost(ingredient: Ingredient): number {
  // If using direct cost entry mode, return the direct cost
  if (ingredient.entryMode === 'direct') {
    return ingredient.directCost || 0;
  }
  
  // Otherwise calculate cost based on the ratio of used quantity to purchase quantity
  // Avoid division by zero
  if (!ingredient.purchaseQuantity) return 0;
  
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