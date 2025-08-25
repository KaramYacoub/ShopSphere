import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import type { FiltersSidebarProps } from "@/types/types";

export default function FiltersSidebar({
  initialSearchTerm = "",
  initialSelectedCategory = "",
  initialPriceRange = { min: "", max: "" },
  onFiltersChange,
  onClearFilters,
  categories,
}: FiltersSidebarProps) {
  const { t } = useTranslation();

  // State for temporary filter values
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(
    initialSelectedCategory
  );
  const [priceRange, setPriceRange] = useState(initialPriceRange);

  // Check if there are changes from initial values
  const hasChanges =
    searchTerm !== initialSearchTerm ||
    selectedCategory !== initialSelectedCategory ||
    priceRange.min !== initialPriceRange.min ||
    priceRange.max !== initialPriceRange.max;

  // Check if any filters are active
  const hasActiveFilters =
    initialSearchTerm ||
    initialSelectedCategory ||
    initialPriceRange.min ||
    initialPriceRange.max;

  // Handle price change
  const handlePriceChange = (field: "min" | "max", value: string) => {
    const numValue = value === "" ? "" : Number(value);
    setPriceRange((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    onFiltersChange({
      searchTerm,
      selectedCategory,
      priceRange,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    onClearFilters();
  };

  // Reset temporary values when initial values change
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
    setSelectedCategory(initialSelectedCategory);
    setPriceRange(initialPriceRange);
  }, [initialSearchTerm, initialSelectedCategory, initialPriceRange]);

  return (
    <div className="lg:sticky lg:top-20 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {t("products.filters.search")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder={t("products.search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t("products.filters.category")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("products.filters.allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("products.filters.allCategories")}
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {t("products.filters.priceRange")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="min-price">{t("products.filters.min")}</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="0"
                value={priceRange.min || ""}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                min="0"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="max-price">{t("products.filters.max")}</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="1000"
                value={priceRange.max || ""}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apply Changes Button */}
      {hasChanges && (
        <Button onClick={applyFilters} className="w-full">
          {t("products.filters.apply")}
        </Button>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          {t("products.filters.clear")}
        </Button>
      )}
    </div>
  );
}
