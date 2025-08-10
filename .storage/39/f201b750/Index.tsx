import { RecipeForm } from "@/components/recipe-form";
import { RecipeResults } from "@/components/recipe-results";
import { useState, useEffect } from "react";
import { Recipe } from "@/lib/types";
import { loadRecipe } from "@/lib/storage";

export default function BakingCostCalculator() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  // Load recipe from localStorage
  useEffect(() => {
    const savedRecipe = loadRecipe();
    if (savedRecipe) {
      // Ensure the recipe has the showResults property
      const updatedRecipe = {
        ...savedRecipe,
        showResults: savedRecipe.showResults || false
      };
      setRecipe(updatedRecipe);
    }
  }, []);

  // Listen for storage changes (in case multiple tabs are open)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRecipe = loadRecipe();
      if (updatedRecipe) {
        setRecipe(updatedRecipe);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">Baking Cost Calculator</h1>
          <p className="text-gray-600">Calculate exactly how much your delicious creations cost to make</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <RecipeForm />
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