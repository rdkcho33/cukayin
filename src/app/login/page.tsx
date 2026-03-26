"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Heart, Lock, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log("Attempting login...")
    
    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized. Please check your environment variables.")
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login Error:", error)
        setError(error.message)
        setLoading(false)
      } else {
        console.log("Login successful, redirecting...")
        router.push("/")
        // Refresh to ensure session is picked up by middleware
        router.refresh()
      }
    } catch (err: any) {
      console.error("Unexpected Error:", err)
      setError(err.message || "An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-none shadow-2xl bg-white/70 backdrop-blur-xl rounded-[2rem] overflow-hidden animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center pb-2 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-primary fill-primary animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-serif text-primary">Selamat Datang</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Masuk untuk melanjutkan perencanaan <br /> masa depan kita bersama.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase font-bold text-muted-foreground ml-1">Email Mitra</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email" 
                  placeholder="email@kita.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/50 border-none rounded-2xl h-12 focus-visible:ring-primary/20"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="Password mitra" className="text-xs uppercase font-bold text-muted-foreground ml-1">Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/50 border-none rounded-2xl h-12 focus-visible:ring-primary/20"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 p-3 rounded-xl text-center">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]" 
              disabled={loading}
            >
              {loading ? "Menyambungkan..." : "Masuk ke Dashboard"}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-8 pt-0 flex justify-center">
          <p className="text-xs text-muted-foreground text-center max-w-[200px]">
            Hanya untuk mitra yang terdaftar. <br /> Hubungi admin untuk akses.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
