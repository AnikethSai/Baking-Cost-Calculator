import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Recipe } from '@/lib/types';
import { Download } from 'lucide-react';

interface RecipeResultsProps {
  recipe: Recipe;
}

export function RecipeResults({ recipe }: RecipeResultsProps) {
  const hasData = recipe.name && recipe.ingredients.length > 0 && recipe.totalUnits > 0;

  const handleDownload = () => {
    let reportContent = `Baking Cost Report\n`;
    reportContent += `====================\n\n`;
    reportContent += `Recipe Name: ${recipe.name}\n`;
    reportContent += `Total Units Produced: ${recipe.totalUnits}\n\n`;
    reportContent += `Ingredient Costs:\n`;
    reportContent += `--------------------\n`;

    recipe.ingredients.forEach(ingredient => {
      reportContent += `${ingredient.name || 'Unnamed Ingredient'}: ₹${(ingredient.cost || 0).toFixed(2)}\n`;
    });

    reportContent += `\n====================\n`;
    reportContent += `Total Batch Cost: ₹${(recipe.totalCost || 0).toFixed(2)}\n`;
    reportContent += `Cost Per Unit: ₹${(recipe.costPerUnit || 0).toFixed(2)}\n`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.name.toLowerCase().replace(/\s+/g, '_')}_cost_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!recipe.showResults || !hasData) {
    return (
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            {!recipe.showResults
              ? "Click 'Generate Report' to see cost calculations."
              : "Enter recipe details to see cost calculations."}
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
                    <TableCell className="text-right">₹{(ingredient.cost || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-medium">Total Batch Cost</h3>
              <p className="text-xl font-semibold">₹{(recipe.totalCost || 0).toFixed(2)}</p>
            </div>

            <div className="flex justify-between items-center bg-green-50 p-4 rounded-md">
              <div>
                <h3 className="text-lg font-medium">Cost Per Unit</h3>
                <p className="text-sm text-muted-foreground">For {recipe.totalUnits} units</p>
              </div>
              <p className="text-2xl font-bold text-green-700">₹{(recipe.costPerUnit || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDownload} className="w-full gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </CardFooter>
    </Card>
  );
}