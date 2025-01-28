import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CourseSortFilterProps {
  onSortChange: (sort: string) => void
  onFilterChange: (filters: { level?: string; category?: string }) => void
  levels: string[]
  categories: string[]
}

export function CourseSortFilter({ onSortChange, onFilterChange, levels, categories }: CourseSortFilterProps) {
  const [level, setLevel] = useState<string>("")
  const [category, setCategory] = useState<string>("")

  const handleSortChange = (value: string) => {
    onSortChange(value)
  }

  const handleFilterChange = (type: "level" | "category", value: string) => {
    if (type === "level") {
      setLevel(value)
    } else {
      setCategory(value)
    }
    onFilterChange({ level: type === "level" ? value : level, category: type === "category" ? value : category })
  }

  const clearFilters = () => {
    setLevel("")
    setCategory("")
    onFilterChange({})
  }

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
      <div className="flex-1">
        <Label htmlFor="sort">Sort by</Label>
        <Select onValueChange={handleSortChange}>
          <SelectTrigger id="sort">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="progress-desc">Progress (High to Low)</SelectItem>
            <SelectItem value="progress-asc">Progress (Low to High)</SelectItem>
            <SelectItem value="recent">Recently Accessed</SelectItem>
            <SelectItem value="title">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Label htmlFor="level">Filter by Level</Label>
        <Select value={level} onValueChange={(value) => handleFilterChange("level", value)}>
          <SelectTrigger id="level">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Label htmlFor="category">Filter by Category</Label>
        <Select value={category} onValueChange={(value) => handleFilterChange("category", value)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

