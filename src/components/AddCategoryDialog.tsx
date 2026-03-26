"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus } from "lucide-react"

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

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori harus diisi"),
  target_amount: z.string().min(1, "Target anggaran harus diisi"),
  status: z.string().min(1, "Status harus dipilih"),
})

interface AddCategoryDialogProps {
  eventId: string
  onSuccess: () => void
}

export function AddCategoryDialog({ eventId, onSuccess }: AddCategoryDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      target_amount: "",
      status: "Unpaid",
    },
  })

  async function onSubmit(values: z.infer<typeof categorySchema>) {
    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          event_id: eventId,
          name: values.name,
          target_amount: parseFloat(values.target_amount),
          status: values.status,
          allocated_amount: 0,
        })

      if (error) throw error

      reset()
      setOpen(false)
      onSuccess()
    } catch (err) {
      console.error("Error adding category:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 cursor-pointer text-sm font-medium">
          <Plus className="mr-2 h-4 w-4" /> Tambah Item
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary">Tambah Anggaran</DialogTitle>
          <DialogDescription>
            Masukkan rincian anggaran baru untuk rencana kalian.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase font-bold text-muted-foreground">Nama Kategori</Label>
            <Input 
              id="name" 
              placeholder="Contoh: Catering, Gedung, MUA" 
              {...register("name")} 
              className="bg-muted/50 border-none rounded-xl"
            />
            {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_amount" className="text-xs uppercase font-bold text-muted-foreground">Target Anggaran (Rp)</Label>
            <Input 
              id="target_amount" 
              type="number" 
              placeholder="Contoh: 15000000" 
              {...register("target_amount")} 
              className="bg-muted/50 border-none rounded-xl"
            />
            {errors.target_amount && <p className="text-[10px] text-destructive">{errors.target_amount.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground">Status Awal</Label>
            <Select onValueChange={(val: string | null) => setValue("status", val || "Unpaid")} defaultValue="Unpaid">
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
              Simpan Kategori
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
