import { RecipeForm } from "@/components/recipe-form";
import { RecipeResults } from "@/components/recipe-results";
import { useState, useEffect } from "react";
import { Recipe } from "@/lib/types";
import { loadRecipe, saveRecipe } from "@/lib/storage";
import { v4 as uuidv4 } from 'uuid';
import { updateRecipeCalculations } from "@/lib/calculator";

const DEFAULT_RECIPE: Recipe = {
  id: uuidv4(),
  name: '',
  ingredients: [],
  totalUnits: 0,
  totalCost: 0,
  costPerUnit: 0,
  showResults: false
};


export default function BakingCostCalculator() {
  const [recipe, setRecipe] = useState<Recipe>(DEFAULT_RECIPE);

  // Load recipe from localStorage on initial render
  useEffect(() => {
    const savedRecipe = loadRecipe();
    if (savedRecipe) {
      setRecipe(savedRecipe);
    }
  }, []);

  // Save recipe to localStorage whenever it changes
  useEffect(() => {
    if (recipe.name || recipe.ingredients.length > 0 || recipe.totalUnits > 0) {
      saveRecipe(recipe);
    }
  }, [recipe]);


  const handleRecipeChange = (newRecipe: Recipe) => {
    const calculatedRecipe = updateRecipeCalculations(newRecipe);
    setRecipe(calculatedRecipe);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">Baking Cost Calculator</h1>
          <p className="text-gray-600">Calculate exactly how much your delicious creations cost to make</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <RecipeForm recipe={recipe} onRecipeChange={handleRecipeChange} />
          </div>
          <div className="space-y-6">
            {recipe && <RecipeResults recipe={recipe} />}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Enter your recipe details on the left, then click "Generate Report" to see your cost analysis on the right.</p>
        </footer>
      </div>
    </div>
  );
}