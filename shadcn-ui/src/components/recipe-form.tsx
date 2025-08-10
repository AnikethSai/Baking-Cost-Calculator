import { useId } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Ingredient, Recipe } from '@/lib/types';
import { Trash2, Calculator } from 'lucide-react';


const UNIT_OPTIONS = ['kg', 'g', 'L', 'ml', 'piece', 'cup', 'tbsp', 'tsp', 'oz', 'lb'];

interface RecipeFormProps {
  recipe: Recipe;
  onRecipeChange: (recipe: Recipe) => void;
}

export function RecipeForm({ recipe, onRecipeChange }: RecipeFormProps) {
  const formId = useId();

  const handleRecipeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRecipeChange({ ...recipe, name: e.target.value });
  };

  const handleTotalUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalUnits = parseFloat(e.target.value) || 0;
    onRecipeChange({ ...recipe, totalUnits });
  };

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: uuidv4(),
      name: '',
      entryMode: 'detailed',
      purchaseUnit: 'g',
      purchasePrice: 0,
      purchaseQuantity: 0,
      usedQuantity: 0,
      usedUnit: 'g',
      directCost: 0,
      cost: 0
    };

    onRecipeChange({ ...recipe, ingredients: [...recipe.ingredients, newIngredient] });
  };

  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    const updatedIngredients = recipe.ingredients.map(ingredient => {
      if (ingredient.id === id) {
        const updatedIngredient = { ...ingredient, ...updates };
        if (updates.purchaseUnit && ingredient.usedUnit === ingredient.purchaseUnit) {
          updatedIngredient.usedUnit = updates.purchaseUnit;
        }
        return updatedIngredient;
      }
      return ingredient;
    });
    onRecipeChange({ ...recipe, ingredients: updatedIngredients });
  };

  const removeIngredient = (id: string) => {
    const updatedIngredients = recipe.ingredients.filter(ingredient => ingredient.id !== id);
    onRecipeChange({ ...recipe, ingredients: updatedIngredients });
  };

  const resetForm = () => {
    if (confirm('Are you sure you want to start a new calculation? This will clear all current data.')) {
      onRecipeChange({
        id: uuidv4(),
        name: '',
        ingredients: [],
        totalUnits: 0,
        totalCost: 0,
        costPerUnit: 0,
        showResults: false
      });
    }
  };

  const generateReport = () => {
    onRecipeChange({ ...recipe, showResults: true });
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
          New Calculation
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