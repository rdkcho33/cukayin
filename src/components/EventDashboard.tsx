"use client"

import * as React from "react"
import { TrendingUp, Wallet, Calendar as CalendarIcon, MoreVertical } from "lucide-react"
import { Label, Pie, PieChart, Cell, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface EventData {
  id: string
  name: string
  target_date: string
  target_amount: number
  total_saved: number
}

interface EventDashboardProps {
  event: EventData
}

export function EventDashboard({ event }: EventDashboardProps) {
  const percentage = Math.min(100, Math.round((event.total_saved / event.target_amount) * 100))
  const remaining = Math.max(0, event.target_amount - event.total_saved)

  const chartData = [
    { name: "Saved", value: event.total_saved, fill: "var(--primary)" },
    { name: "Remaining", value: remaining, fill: "var(--secondary)" },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 overflow-hidden border-none shadow-premium bg-white/50 backdrop-blur-sm">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-2xl font-serif text-primary">{event.name} Progress</CardTitle>
          <CardDescription className="text-muted-foreground">
            {new Date(event.target_date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-primary text-3xl font-bold"
                            >
                              {percentage}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-xs uppercase"
                            >
                              Tercapai
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none text-primary">
            Target: Rp {event.target_amount.toLocaleString("id-ID")} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Sisa tabungan: Rp {remaining.toLocaleString("id-ID")}
          </div>
        </CardFooter>
      </Card>

      <Card className="col-span-1 md:col-span-1 lg:col-span-2 border-none shadow-premium bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-primary">Ringkasan Tabungan</CardTitle>
          <CardDescription>Status terkumpul vs target total</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Total Terkumpul</span>
              <span className="text-primary font-bold">Rp {event.total_saved.toLocaleString("id-ID")}</span>
            </div>
            <Progress value={percentage} className="h-3 bg-secondary" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-secondary/50 flex flex-col gap-1">
              <Wallet className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground uppercase font-semibold">Terkumpul</span>
              <span className="text-lg font-bold text-primary">Rp {event.total_saved.toLocaleString("id-ID")}</span>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 flex flex-col gap-1">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground uppercase font-semibold">Target</span>
              <span className="text-lg font-bold text-foreground">Rp {event.target_amount.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-3 py-1 rounded-full">
            {remaining === 0 ? "Target Tercapai! 🎉" : `${percentage}% dari tujuan`}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  )
}
