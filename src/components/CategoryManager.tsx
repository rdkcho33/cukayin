"use client"

import * as React from "react"
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  target_amount: number
  allocated_amount: number
  status: string
}

interface CategoryManagerProps {
  categories: Category[]
  onAdd: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function CategoryManager({ categories, onAdd, onEdit, onDelete }: CategoryManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif text-primary">Kelola Anggaran</h3>
        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
          <Plus className="mr-2 h-4 w-4" /> Tambah Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const percentage = Math.min(100, Math.round((category.allocated_amount / category.target_amount) * 100))
          const isPaid = category.status === "Paid in Full"
          const isDP = category.status === "DP Paid"

          return (
            <Card key={category.id} className="border-none shadow-premium bg-white/40 backdrop-blur-sm group transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-medium text-foreground">{category.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`rounded-full text-[10px] uppercase font-bold border-none px-2 py-0.5 ${
                      isPaid ? "bg-green-100 text-green-700" : isDP ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {category.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(category.id)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(category.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Terkumpul: Rp {category.allocated_amount.toLocaleString("id-ID")}</span>
                  <span className="text-primary">Target: Rp {category.target_amount.toLocaleString("id-ID")}</span>
                </div>
                <Progress value={percentage} className="h-2 bg-secondary" />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
