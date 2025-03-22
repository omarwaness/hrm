"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
export default function LeaveRequest() {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validate dates
    if (!fromDate || !toDate) {
      toast({
        title: "Error",
        description: "Please select both from and to dates",
        variant: "destructive",
      })
      return
    }
    // Validate reason
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your leave request",
        variant: "destructive",
      })
      return
    }
    // Submit form data
    console.log({ fromDate, toDate, reason })
    toast({
      title: "Success",
      description: "Your leave request has been submitted",
    })
    // Reset form
    setFromDate("")
    setToDate("")
    setReason("")
  }

  return (
    <main className="container mx-auto py-10 flex justify-center">
        <div className="w-full max-w-4xl">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold mb-6">Leave Request</h1>
                <p className="text-muted-foreground">Submit your leave request with the dates and reason</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="from-date">From Date</Label>
                        <Input id="from-date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="to-date">To Date</Label>
                        <Input id="to-date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Leave</Label>
                    <Textarea
                        id="reason"
                        placeholder="Please provide details about your leave request"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[150px]"
                        required
                    />
                </div>
                <Button type="submit" className="w-full md:w-auto">
                    Submit Request
                </Button>
            </form>
        </div>
    </main>
  )
}