"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { formatCurrency, parseCurrency } from "@/lib/utils"

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori harus diisi"),
  target_amount: z.string().min(1, "Target anggaran harus diisi"),
  status: z.string().min(1, "Status harus dipilih"),
})

interface Category {
  id: string
  name: string
  target_amount: number
  status: string
}

interface EditCategoryDialogProps {
  category: Category
  onSuccess: () => void
}

export function EditCategoryDialog({ category, onSuccess }: EditCategoryDialogProps) {
  const [open, setOpen] = React.useState(false)
  
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      target_amount: formatCurrency(category.target_amount),
      status: category.status,
    },
  })

  // Reset form when category changes or dialog opens
  React.useEffect(() => {
    if (open) {
      reset({
        name: category.name,
        target_amount: formatCurrency(category.target_amount),
        status: category.status,
      })
    }
  }, [category, open, reset])

  async function onSubmit(values: z.infer<typeof categorySchema>) {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: values.name,
          target_amount: parseCurrency(values.target_amount),
          status: values.status,
        })
        .eq('id', category.id)

      if (error) throw error

      setOpen(false)
      onSuccess()
    } catch (err) {
      console.error("Error updating category:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary">Edit Nama & Harga</DialogTitle>
          <DialogDescription>
            Perbarui rincian anggaran untuk item ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-xs uppercase font-bold text-muted-foreground">Nama Kategori</Label>
            <Input 
              id="edit-name" 
              placeholder="Contoh: Catering, Gedung, MUA" 
              {...register("name")} 
              className="bg-muted/50 border-none rounded-xl"
            />
            {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-target_amount" className="text-xs uppercase font-bold text-muted-foreground">Target Anggaran (Rp)</Label>
            <Input 
              id="edit-target_amount" 
              type="text" 
              placeholder="Contoh: 15.000.000" 
              {...register("target_amount", {
                onChange: (e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/\D/g, "");
                  const formatted = formatCurrency(numericValue);
                  setValue("target_amount", formatted);
                }
              })} 
              className="bg-muted/50 border-none rounded-xl"
            />
            {errors.target_amount && <p className="text-[10px] text-destructive">{errors.target_amount.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground">Status</Label>
            <Select onValueChange={(val: string | null) => setValue("status", val || "Unpaid")} defaultValue={category.status}>
              <SelectTrigger className="bg-muted/50 border-none rounded-xl">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unpaid">Belum Bayar (Unpaid)</SelectItem>
                <SelectItem value="DP Paid">DP Sudah Bayar</SelectItem>
                <SelectItem value="Paid in Full">Sudah Lunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
