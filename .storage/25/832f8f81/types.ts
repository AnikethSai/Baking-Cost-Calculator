export interface Ingredient {
  id: string;
  name: string;
  purchaseUnit: string;
  purchasePrice: number;
  purchaseQuantity: number;
  usedQuantity: number;
  usedUnit: string;
  cost: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  totalUnits: number;
  totalCost: number;
  costPerUnit: number;
}