import { useState, useEffect } from 'react';
import { useId } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ingredient, Recipe } from '@/lib/types';
import { updateRecipeCalculations } from '@/lib/calculator';
import { saveRecipe, loadRecipe } from '@/lib/storage';
import { Trash2, FileText, Calculator } from 'lucide-react';

const DEFAULT_RECIPE: Recipe = {
  id: uuidv4(),
  name: '',
  ingredients: [],
  totalUnits: 0,
  totalCost: 0,
  costPerUnit: 0,
  showResults: false
};

const UNIT_OPTIONS = ['kg', 'g', 'L', 'ml', 'piece', 'cup', 'tbsp', 'tsp', 'oz', 'lb'];

export function RecipeForm() {
  const [recipe, setRecipe] = useState<Recipe>(DEFAULT_RECIPE);
  const formId = useId();

  useEffect(() => {
    const savedRecipe = loadRecipe();
    if (savedRecipe) {
      setRecipe(savedRecipe);
    }
  }, []);

  useEffect(() => {
    // Save recipe whenever it changes
    if (recipe.name || recipe.ingredients.length > 0 || recipe.totalUnits > 0) {
      saveRecipe(recipe);
    }
  }, [recipe]);

  const handleRecipeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe(prev => ({ ...prev, name: e.target.value }));
  };

  const handleTotalUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalUnits = parseFloat(e.target.value) || 0;
    const updatedRecipe = { ...recipe, totalUnits };
    setRecipe(updateRecipeCalculations(updatedRecipe));
  };

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: uuidv4(),
      name: '',
      entryMode: 'detailed',  // Default to detailed mode
      purchaseUnit: 'g',
      purchasePrice: 0,
      purchaseQuantity: 0,
      usedQuantity: 0,
      usedUnit: 'g',
      directCost: 0,
      cost: 0
    };

    setRecipe(prev => {
      const updatedRecipe = { 
        ...prev, 
        ingredients: [...prev.ingredients, newIngredient]
      };
      return updateRecipeCalculations(updatedRecipe);
    });
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    setRecipe(prev => {
      let updatedIngredients = prev.ingredients.map(ingredient => {
        if (ingredient.id === id) {
          // Create updated ingredient
          const updatedIngredient = { ...ingredient, ...updates };
          
          // If the purchase unit was updated, sync it with the used unit (linked units)
          if (updates.purchaseUnit && ingredient.usedUnit === ingredient.purchaseUnit) {
            updatedIngredient.usedUnit = updates.purchaseUnit;
          }
          
          return updatedIngredient;
        }
        return ingredient;
      });

      const updatedRecipe = { ...prev, ingredients: updatedIngredients };
      return updateRecipeCalculations(updatedRecipe);
    });
  };

  const removeIngredient = (id: string) => {
    setRecipe(prev => {
      const updatedIngredients = prev.ingredients.filter(ingredient => ingredient.id !== id);
      const updatedRecipe = { ...prev, ingredients: updatedIngredients };
      return updateRecipeCalculations(updatedRecipe);
    });
  };

  const resetForm = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setRecipe(DEFAULT_RECIPE);
    }
  };

  const generateReport = () => {
    // Create a copy of the recipe with showResults set to true
    const reportRecipe = {
      ...recipe,
      showResults: true
    };
    // Update the local state
    setRecipe(reportRecipe);
    // Save to localStorage to ensure it persists
    saveRecipe(reportRecipe);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${formId}-recipe-name`}>Recipe Name</Label>
                <Input
                  id={`${formId}-recipe-name`}
                  placeholder="E.g., Chocolate Chip Cookies"
                  value={recipe.name}
                  onChange={handleRecipeNameChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${formId}-total-units`}>Total Units Produced</Label>
                <Input
                  id={`${formId}-total-units`}
                  type="number"
                  placeholder="E.g., 20"
                  value={recipe.totalUnits || ''}
                  onChange={handleTotalUnitsChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ingredients</CardTitle>
          <Button onClick={addIngredient} className="bg-blue-500 hover:bg-blue-600">Add Ingredient</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recipe.ingredients.length === 0 && (
              <p className="text-center text-muted-foreground">No ingredients added yet.</p>
            )}

            {recipe.ingredients.map((ingredient, index) => (
              <Card key={ingredient.id} className="p-4 bg-gray-50/50">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-ingredient-${index}-name`}>Ingredient Name</Label>
                      <Input
                        id={`${formId}-ingredient-${index}-name`}
                        placeholder="E.g., Flour"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(ingredient.id, { name: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`${formId}-ingredient-${index}-mode`}>Direct Cost Entry</Label>
                      <Switch
                        id={`${formId}-ingredient-${index}-mode`}
                        checked={ingredient.entryMode === 'direct'}
                        onCheckedChange={(checked) => 
                          updateIngredient(ingredient.id, { entryMode: checked ? 'direct' : 'detailed' })
                        }
                      />
                    </div>
                  </div>

                  {ingredient.entryMode === 'direct' ? (
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-ingredient-${index}-direct-cost`}>
                        Direct Cost for this Ingredient
                      </Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">₹</span>
                        <Input
                          id={`${formId}-ingredient-${index}-direct-cost`}
                          type="number"
                          placeholder="Enter cost"
                          value={ingredient.directCost || ''}
                          onChange={(e) => updateIngredient(ingredient.id, { 
                            directCost: parseFloat(e.target.value) || 0 
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Purchase Details</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder="Price"
                            className="flex-1"
                            value={ingredient.purchasePrice || ''}
                            onChange={(e) => updateIngredient(ingredient.id, { 
                              purchasePrice: parseFloat(e.target.value) || 0 
                            })}
                          />
                          <span className="flex items-center">for</span>
                          <Input
                            type="number"
                            placeholder="Qty"
                            className="flex-1"
                            value={ingredient.purchaseQuantity || ''}
                            onChange={(e) => updateIngredient(ingredient.id, { 
                              purchaseQuantity: parseFloat(e.target.value) || 0 
                            })}
                          />
                          <Select
                            value={ingredient.purchaseUnit}
                            onValueChange={(value) => updateIngredient(ingredient.id, { purchaseUnit: value })}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {UNIT_OPTIONS.map(unit => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Recipe Usage</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder="Used Qty"
                            className="flex-1"
                            value={ingredient.usedQuantity || ''}
                            onChange={(e) => updateIngredient(ingredient.id, { 
                              usedQuantity: parseFloat(e.target.value) || 0 
                            })}
                          />
                          <Select
                            value={ingredient.usedUnit}
                            onValueChange={(value) => updateIngredient(ingredient.id, { usedUnit: value })}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {UNIT_OPTIONS.map(unit => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-end justify-between">
                    <div className="flex-1 space-y-2">
                      <Label>Cost in Recipe</Label>
                      <div className="text-lg font-semibold">
                        ₹{(ingredient.cost || 0).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeIngredient(ingredient.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={resetForm} className="text-red-500">
          Clear All
        </Button>
        <Button 
          onClick={generateReport} 
          className="bg-green-600 hover:bg-green-700 gap-2"
          disabled={recipe.ingredients.length === 0 || !recipe.name || recipe.totalUnits <= 0}
        >
          <Calculator className="h-4 w-4" />
          Generate Report
        </Button>
      </div>
    </div>
  );
}