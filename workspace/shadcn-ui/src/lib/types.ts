export interface Ingredient {
  id: string;
  name: string;
  entryMode: 'detailed' | 'direct'; // New field to toggle between entry modes
  purchaseUnit: string;
  purchasePrice: number;
  purchaseQuantity: number;
  usedQuantity: number;
  usedUnit: string;
  directCost: number; // Direct cost entry field
  cost: number; // Calculated or direct cost
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  totalUnits: number;
  totalCost: number;
  costPerUnit: number;
  showResults: boolean; // Flag to control when to show results
}