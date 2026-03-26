"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Wallet, Calendar as CalendarIcon, User, Tag, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  amount: z.string().min(1, "Jumlah harus diisi"),
  event_id: z.string().min(1, "Acara harus dipilih"),
  category_id: z.string().optional(),
  contributor_name: z.string().min(1, "Penyetor harus diisi"),
  description: z.string().min(1, "Keterangan harus diisi"),
})

interface AddTransactionFormProps {
  events: { id: string; name: string }[]
  categories: { id: string; name: string; event_id: string }[]
  onSuccess: () => void
}

export function AddTransactionForm({ events, categories, onSuccess }: AddTransactionFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      event_id: "",
      category_id: "",
      contributor_name: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const amountNum = parseFloat(values.amount)
      
      const { error } = await supabase
        .from('transactions')
        .insert({
          amount: amountNum,
          description: values.description,
          event_id: values.event_id,
          category_id: values.category_id || null,
          contributor_name: values.contributor_name,
        })

      if (error) throw error

      if (values.category_id) {
        const { data: catData, error: catFetchError } = await supabase
          .from('categories')
          .select('allocated_amount')
          .eq('id', values.category_id)
          .single()

        if (!catFetchError && catData) {
          await supabase
            .from('categories')
            .update({ allocated_amount: (catData.allocated_amount || 0) + amountNum })
            .eq('id', values.category_id)
        }
      }

      reset()
      onSuccess()
    } catch (err) {
      console.error("Error saving transaction:", err)
    }
  }

  const selectedEventId = watch("event_id")
  const filteredCategories = categories.filter(c => c.event_id === selectedEventId)

  return (
    <Card className="border-none shadow-premium bg-white/50 backdrop-blur-md overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-xl font-serif text-primary flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Catat Setoran Baru
        </CardTitle>
        <CardDescription>Masukkan rincian tabungan kerja sama kalian.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Wallet className="h-3 w-3" /> Jumlah (Rp)
              </Label>
              <Input 
                placeholder="Contoh: 1000000" 
                {...register("amount")} 
                className="bg-white/50 border-none rounded-xl" 
                type="number"
              />
              {errors.amount && <p className="text-[10px] text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> Penyetor
              </Label>
              <Input 
                placeholder="Nama kamu" 
                {...register("contributor_name")} 
                className="bg-white/50 border-none rounded-xl" 
              />
              {errors.contributor_name && <p className="text-[10px] text-destructive">{errors.contributor_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" /> Acara
              </Label>
              <Select onValueChange={(val: string | null) => setValue("event_id", val || "")}>
                <SelectTrigger className="bg-white/50 border-none rounded-xl">
                  <SelectValue placeholder="Pilih Acara" />
                </SelectTrigger>
                <SelectContent>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.event_id && <p className="text-[10px] text-destructive">{errors.event_id.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1">
                <Tag className="h-3 w-3" /> Kategori (Opsional)
              </Label>
              <Select onValueChange={(val: string | null) => setValue("category_id", val || "")}>
                <SelectTrigger className="bg-white/50 border-none rounded-xl">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-1">
              <FileText className="h-3 w-3" /> Keterangan
            </Label>
            <Input 
              placeholder="Untuk apa setoran ini?" 
              {...register("description")} 
              className="bg-white/50 border-none rounded-xl" 
            />
            {errors.description && <p className="text-[10px] text-destructive">{errors.description.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold shadow-lg shadow-primary/20">
            Simpan Setoran
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
