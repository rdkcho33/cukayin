"use client"

import * as React from "react"
import { Heart, Sparkles, LogOut, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EventDashboard } from "@/components/EventDashboard"
import { CategoryManager } from "@/components/CategoryManager"
import { SavingsLog } from "@/components/SavingsLog"
import { AddTransactionForm } from "@/components/AddTransactionForm"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [events, setEvents] = React.useState<any[]>([])
  const [categories, setCategories] = React.useState<any[]>([])
  const [transactions, setTransactions] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchData = async () => {
    try {
      const { data: eventData } = await supabase.from('events').select('*')
      const { data: catData } = await supabase.from('categories').select('*')
      const { data: transData } = await supabase.from('transactions').select('*')

      if (eventData) setEvents(eventData)
      if (catData) setCategories(catData)
      if (transData) setTransactions(transData)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()

    // Realtime channel
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Heart className="h-12 w-12 text-primary animate-pulse fill-primary" />
          <p className="text-primary font-serif italic">Menyiapkan rencana masa depan kita...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/60 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Heart className="h-5 w-5 text-primary fill-primary" />
            </div>
            <h1 className="text-xl font-serif font-bold text-primary tracking-tight">OurSavings</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-primary uppercase">Happy Couple</span>
              <span className="text-[10px] text-muted-foreground italic">Together since 2020</span>
            </div>
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 pt-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-serif text-primary flex items-center gap-2">
              Halo, Sayang! <Sparkles className="h-6 w-6 text-accent" />
            </h2>
            <p className="text-muted-foreground">Siap untuk melangkah ke jenjang berikutnya hari ini?</p>
          </div>
          <div className="flex items-center gap-2 bg-white/50 p-1 rounded-full border border-primary/10">
            <Button size="sm" className="rounded-full bg-primary text-white px-6">Dashboard</Button>
            <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground px-6 hover:text-primary">Riwayat</Button>
          </div>
        </div>

        <Tabs defaultValue="lamaran" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-secondary/50 rounded-full p-1 h-12">
            <TabsTrigger value="lamaran" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-serif">
              Lamaran (Pertunangan)
            </TabsTrigger>
            <TabsTrigger value="wedding" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-serif">
              Wedding (Pernikahan)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lamaran" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {events[0] ? (
              <>
                <EventDashboard event={events[0]} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <CategoryManager 
                      categories={categories.filter(c => c.event_id === events[0].id)} 
                      onAdd={() => {}} 
                      onEdit={() => {}} 
                      onDelete={() => {}} 
                    />
                    <SavingsLog transactions={transactions.filter(t => t.event_id === events[0].id)} />
                  </div>
                  <div className="space-y-8">
                    <AddTransactionForm events={events} categories={categories} onSuccess={fetchData} />
                    <Card className="border-none shadow-premium bg-primary/5 p-6 rounded-3xl">
                      <h4 className="font-serif text-primary text-lg mb-2">Tips Hemat 🕊️</h4>
                      <p className="text-sm text-primary/70 italic">"Gunakan tema minimalis untuk lamaran agar bajet bisa dialokasikan lebih ke arah pernikahan nanti."</p>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white/50 rounded-[3rem] shadow-premium">
                <Sparkles className="mx-auto h-12 w-12 text-primary/20 mb-4" />
                <h3 className="text-2xl font-serif text-primary">Belum ada acara Lamaran</h3>
                <p className="text-muted-foreground mt-2">Tambahkan data "Lamaran" di database untuk mulai melacak.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="wedding" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {events[1] ? (
              <>
                <EventDashboard event={events[1]} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <CategoryManager 
                      categories={categories.filter(c => c.event_id === events[1].id)} 
                      onAdd={() => {}} 
                      onEdit={() => {}} 
                      onDelete={() => {}} 
                    />
                    <SavingsLog transactions={transactions.filter(t => t.event_id === events[1].id)} />
                  </div>
                  <div className="space-y-8">
                    <AddTransactionForm events={events} categories={categories} onSuccess={fetchData} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white/50 rounded-[3rem] shadow-premium">
                <Sparkles className="mx-auto h-12 w-12 text-primary/20 mb-4" />
                <h3 className="text-2xl font-serif text-primary">Belum ada acara Pernikahan</h3>
                <p className="text-muted-foreground mt-2">Tambahkan data "Wedding" di database untuk mulai melacak.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary opacity-50" />
    </main>
  )
}
