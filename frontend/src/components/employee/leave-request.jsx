"use client"
import React, { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function LeaveRequest() {
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [reason, setReason] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!fromDate || !toDate) {
      alert("Please select both from and to dates.")
      return
    }

    if (!reason.trim()) {
      alert("Please provide a reason for your leave request.")
      return
    }

    console.log({ fromDate, toDate, reason })
    alert("Leave request submitted!")

    setFromDate(undefined)
    setToDate(undefined)
    setReason("")
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="mx-auto w-full max-w-3xl space-y-6 py-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Leave Request</h1>
          <p className="text-muted-foreground">Submit your leave dates and reason below.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave Details</CardTitle>
            <CardDescription>Choose your dates and fill in the reason for your leave.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* From Date */}
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* To Date */}
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        {toDate ? format(toDate, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you are requesting leave"
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
