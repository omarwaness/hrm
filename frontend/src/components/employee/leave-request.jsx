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
import {jwtDecode} from 'jwt-decode'
import Loading from "../Loading"
export default function LeaveRequest() {
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [reason, setReason] = useState("")
const [isLoading,setIsLoading]=useState(false)
  const handleSubmit =async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const sender= decoded.email;
    try {
      const response = await fetch("http://localhost:5000/api/leave/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({sender,fromDate, toDate,reason }),
      });
    
      if (!response.ok) {

        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
        setIsLoading(false)
        return;
      }
  
      const data = await response.json();
      console.log("Message submitted:", data);
  
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }

   
    if (!fromDate || !toDate) {
      alert("Please select both from and to dates.")
      setIsLoading(false)
      return
    }

    if (!reason.trim()) {
      alert("Please provide a reason for your leave request.")
      setIsLoading(false)
      return
    }

    console.log({ fromDate, toDate, reason })
    

    setFromDate(undefined)
    setToDate(undefined)
    setReason("")
    setIsLoading(false)
  }
if (isLoading){return <Loading/>    }
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
