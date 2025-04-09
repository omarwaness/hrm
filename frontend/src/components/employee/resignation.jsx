"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResignationPage() {
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [fullName, setFullName] = useState("")
  const [position, setPosition] = useState("")
  const [resignationDate, setResignationDate] = useState(undefined)
  const [lastWorkingDay, setLastWorkingDay] = useState(undefined)
  const [reason, setReason] = useState("")

  // Validation state
  const [errors, setErrors] = useState({
    fullName: "",
    position: "",
    resignationDate: "",
    lastWorkingDay: "",
  })

  // Form validation
  function validateForm() {
    const newErrors = {
      fullName: "",
      position: "",
      resignationDate: "",
      lastWorkingDay: "",
    }

    let isValid = true

    if (!fullName || fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters."
      isValid = false
    }

    if (!position || position.length < 2) {
      newErrors.position = "Position must be at least 2 characters."
      isValid = false
    }

    if (!resignationDate) {
      newErrors.resignationDate = "Resignation date is required."
      isValid = false
    }

    if (!lastWorkingDay) {
      newErrors.lastWorkingDay = "Last working day is required."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault()

    if (validateForm()) {
      console.log({
        fullName,
        position,
        resignationDate,
        lastWorkingDay,
        reason,
      })
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Resignation Submitted</CardTitle>
            <CardDescription className="text-center">Your resignation has been successfully submitted.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <p className="text-center text-gray-600">
              Thank you for your submission. A copy of your resignation letter has been sent to your email address.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setSubmitted(false)}>
              Submit Another Resignation
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-3xl space-y-6 py-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Resignation Letter</h1>
          <p className="text-gray-500">Fill out the form below to submit your formal resignation.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Please provide your details and resignation information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">
                    Position
                  </label>
                  <Input
                    id="position"
                    placeholder="Software Engineer"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                  {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resignation Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !resignationDate && "text-muted-foreground")}
                      >
                        {resignationDate ? format(resignationDate, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={resignationDate}
                        onSelect={setResignationDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-gray-500">The date you are submitting your resignation.</p>
                  {errors.resignationDate && <p className="text-sm text-red-500">{errors.resignationDate}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Working Day</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !lastWorkingDay && "text-muted-foreground")}
                      >
                        {lastWorkingDay ? format(lastWorkingDay, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={lastWorkingDay}
                        onSelect={setLastWorkingDay}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-gray-500">Your intended last day of work.</p>
                  {errors.lastWorkingDay && <p className="text-sm text-red-500">{errors.lastWorkingDay}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium">
                  Reason for Resignation (Optional)
                </label>
                <Textarea
                  id="reason"
                  placeholder="I am writing to inform you of my decision to resign from my position..."
                  className="min-h-[120px] resize-y"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <p className="text-xs text-gray-500">Provide a brief explanation for your resignation if you wish.</p>
              </div>

              <Button type="submit" className="w-full">
                Submit Resignation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
