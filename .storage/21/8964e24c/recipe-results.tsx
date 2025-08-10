import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Recipe } from '@/lib/types';

interface RecipeResultsProps {
  recipe: Recipe;
}

export function RecipeResults({ recipe }: RecipeResultsProps) {
  const hasData = recipe.name && recipe.ingredients.length > 0 && recipe.totalUnits > 0;

  if (!hasData) {
    return (
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Enter recipe details to see cost calculations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Summary: {recipe.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Ingredient Costs</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingredient</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipe.ingredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell>{ingredient.name || 'Unnamed ingredient'}</TableCell>
                    <TableCell className="text-right">${(ingredient.cost || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-medium">Total Batch Cost</h3>
              <p className="text-xl font-semibold">${(recipe.totalCost || 0).toFixed(2)}</p>
            </div>

            <div className="flex justify-between items-center bg-green-50 p-4 rounded-md">
              <div>
                <h3 className="text-lg font-medium">Cost Per Unit</h3>
                <p className="text-sm text-muted-foreground">For {recipe.totalUnits} units</p>
              </div>
              <p className="text-2xl font-bold text-green-700">${(recipe.costPerUnit || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}