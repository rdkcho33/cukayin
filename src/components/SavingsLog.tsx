"use client"

import * as React from "react"
import { History, Search, Filter, ArrowUpRight, Download } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface Transaction {
  id: string
  amount: number
  description: string
  contributor_name: string
  category_name?: string
  created_at: string
}

interface SavingsLogProps {
  transactions: Transaction[]
}

export function SavingsLog({ transactions }: SavingsLogProps) {
  const [search, setSearch] = React.useState("")

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.contributor_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-serif text-primary flex items-center gap-2">
          <History className="h-5 w-5" /> Riwayat Tabungan
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari deskripsi atau nama..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/50 border-none rounded-full"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 text-primary">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 text-primary">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border-none shadow-premium bg-white/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-primary font-bold">Tanggal</TableHead>
              <TableHead className="text-primary font-bold">Penyetor</TableHead>
              <TableHead className="text-primary font-bold">Kategori</TableHead>
              <TableHead className="text-primary font-bold">Keterangan</TableHead>
              <TableHead className="text-right text-primary font-bold">Jumlah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((t) => (
                <TableRow key={t.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(t.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 rounded-full font-medium">
                      {t.contributor_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{t.category_name || "Lainnya"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{t.description}</TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    <div className="flex items-center justify-end gap-1">
                      Rp {formatCurrency(t.amount)}
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                  Belum ada catatan setoran.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
