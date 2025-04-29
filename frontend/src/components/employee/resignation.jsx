"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { jwtDecode } from "jwt-decode"
import Loading from "../Loading"
import {io} from 'socket.io-client'

export default function ResignationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [fullName, setFullName] = useState("")
  const [lastWorkingDay, setLastWorkingDay] = useState(undefined)
  const [reason, setReason] = useState("")
  const [status, setStatus] = useState(null)
  const [socket, setSocket] = useState(null)

  const [errors, setErrors] = useState({
    fullName: "",
    lastWorkingDay: "",
  })

  function validateForm() {
    const newErrors = {
      fullName: "",
      lastWorkingDay: "",
    }

    let isValid = true

    if (!fullName || fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters."
      isValid = false
    }

    if (!lastWorkingDay) {
      newErrors.lastWorkingDay = "Last working day is required."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const decoded = jwtDecode(token)
      const sender = decoded.email
      const firstName = fullName
      const lastDay = lastWorkingDay

      const response = await fetch("http://localhost:5000/api/resignation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sender, firstName, lastDay, reason }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit resignation")
      }
      if (socket) {
        socket.emit("newMessage", {
          sender,
          receiver:"manager@gmail.com",
          content:reason,
        });
      }
      setStatus({ type: "success", message: "Resignation submitted successfully!" })
      setFullName("")
      setLastWorkingDay(undefined)
      setReason("")
      setSubmitted(true)
    } catch (err) {
      setStatus({ type: "error", message: err.message })
      console.error(err)
    } finally {
      setIsLoading(false)

      setSubmitted(true)
      setFullName("")
      setLastWorkingDay(undefined)
      setReason("")
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus({ type: "error", message: "User not authenticated" });
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      setStatus({ type: "error", message: "Invalid token" });
      return;
    }

    const userEmail = decoded.email;

    // Connect to Socket.IO server on port 5001 with userEmail as query param
    const socketIo = io("http://localhost:5001", {
      query: { email: userEmail },
      transports: ["websocket", "polling"],
    });

    socketIo.on("connect", () => {
      console.log("Connected to Socket.IO server on port 5001");
    });

    socketIo.on("message", (msg) => {
      console.log("Received socket message:", msg);
      if (msg.type === "NEW_MESSAGE") {
        setStatus({
          type: "success",
          message: `New message received from ${msg.payload.sender}`,
        });
      }
    });

    socketIo.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
      setStatus({ type: "error", message: "Real-time connection error" });
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);
  if (isLoading) return <Loading />;

return (
  <div className="flex min-h-screen flex-col p-2">
    <div className="mx-auto w-full max-w-3xl space-y-6 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Resignation Letter</h1>
        <p className="text-gray-500">
          Fill out the form below to submit your formal resignation.
        </p>
      </div>

      {status && (
        <div
          className={`text-center ${
            status.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* If submitted, show success message instead of form */}
      {submitted ? (
        <Card className="bg-green-50 border border-green-200">
          <CardHeader className="flex flex-row items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            <CardTitle className="text-green-700 text-lg">Resignation Submitted</CardTitle>
          </CardHeader>
          <CardContent className="text-green-600">
            Your resignation has been submitted successfully. Thank you for your service.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Please provide your details and resignation information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your form inputs here */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
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

                {/* Last Working Day */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Working Day</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !lastWorkingDay && "text-muted-foreground"
                        )}
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
                  {errors.lastWorkingDay && (
                    <p className="text-sm text-red-500">{errors.lastWorkingDay}</p>
                  )}
                </div>
              </div>

              {/* Reason */}
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
                <p className="text-xs text-gray-500">
                  Provide a brief explanation for your resignation if you wish.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Submit Resignation
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
);
}
