import { Recipe } from '@/lib/types';

const RECIPE_STORAGE_KEY = 'bakingCalculator_currentRecipe';

export const saveRecipe = (recipe: Recipe): void => {
  localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipe));
};

export const loadRecipe = (): Recipe | null => {
  const stored = localStorage.getItem(RECIPE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearRecipe = (): void => {
  localStorage.removeItem(RECIPE_STORAGE_KEY);
};