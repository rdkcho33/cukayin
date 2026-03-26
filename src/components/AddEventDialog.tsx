"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Sparkles } from "lucide-react"

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
import { supabase } from "@/lib/supabase"

const eventSchema = z.object({
  name: z.string().min(1, "Nama acara harus diisi"),
  target_date: z.string().min(1, "Tanggal acara harus diisi"),
})

interface AddEventDialogProps {
  onSuccess: () => void
}

export function AddEventDialog({ onSuccess }: AddEventDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      target_date: "",
    },
  })

  async function onSubmit(values: z.infer<typeof eventSchema>) {
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          name: values.name,
          target_date: values.target_date,
          icon_name: values.name.toLowerCase().includes("lamaran") ? "heart" : "sparkles"
        })

      if (error) throw error

      reset()
      setOpen(false)
      onSuccess()
    } catch (err) {
      console.error("Error adding event:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-4 text-lg font-serif cursor-pointer">
          <PlusCircle className="mr-2 h-5 w-5" /> Buat Acara Baru
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-primary">Buat Acara Baru</DialogTitle>
          <DialogDescription>
            Contoh: "Lamaran" atau "Wedding".
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase font-bold text-muted-foreground">Nama Acara</Label>
            <Input 
              id="name" 
              placeholder="Contoh: Lamaran (Engagement)" 
              {...register("name")} 
              className="bg-muted/50 border-none rounded-xl"
            />
            {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_date" className="text-xs uppercase font-bold text-muted-foreground">Tanggal Acara</Label>
            <Input 
              id="target_date" 
              type="date" 
              {...register("target_date")} 
              className="bg-muted/50 border-none rounded-xl"
            />
            {errors.target_date && <p className="text-[10px] text-destructive">{errors.target_date.message}</p>}
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold">
              Simpan Acara
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
