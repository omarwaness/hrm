import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getUserByEmail } from "@/services/userService"
import { getLeaveRequestsByEmail } from "@/services/leaveService"
import { format, subMonths } from "date-fns"
import { saveReport } from "@/services/reportService"

function GenerateReport() {
  const [email, setEmail] = useState("")
  const [chartData, setChartData] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [totalRequests, setTotalRequests] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setChartData([])
    setUserInfo(null)
    setTotalRequests(0)
    setSaveMessage("")
    setLoading(true)

    try {
      const user = await getUserByEmail(email)
      if (!user) throw new Error("User not found.")

      const leaves = await getLeaveRequestsByEmail(email)

      const today = new Date()
      const monthMap = new Map()

      for (let i = 5; i >= 0; i--) {
        const date = subMonths(today, i)
        const key = format(date, "MMMM yyyy")
        monthMap.set(key, 0)
      }

      leaves.forEach((leave) => {
        const date = new Date(leave.createdAt)
        const key = format(date, "MMMM yyyy")
        monthMap.set(key, (monthMap.get(key) || 0) + 1)
      })

      const formatted = Array.from(monthMap.entries())
        .sort((a, b) => new Date("1 " + a[0]) - new Date("1 " + b[0]))
        .map(([month, requests]) => ({ month, requests }))

      setChartData(formatted)
      setUserInfo(user)
      setTotalRequests(leaves.length)
    } catch (err) {
      console.error(err)
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveReport = async () => {
    try {
      await saveReport({
        employeeEmail: userInfo.email,
        employeeFirstName: userInfo.firstName,
        employeeLastName: userInfo.lastName,
        totalRequests,
        breakdown: chartData,
      })
      setSaveMessage("Report saved successfully.")
    } catch (err) {
      setSaveMessage("Failed to save report.")
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Input Card */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Search Employee Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Employee Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="employee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>
      </Card>

      {/* Report Card */}
      {userInfo && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle className="text-2xl font-bold">
              Employee Report
            </CardTitle>
            <Button size="sm" onClick={handleSaveReport}>
              Save Report
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">First Name</Label>
                <p className="font-medium">{userInfo.firstName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Name</Label>
                <p className="font-medium">{userInfo.lastName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{userInfo.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Leave Requests</Label>
                <p className="font-medium">{totalRequests}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="requests"
                    fill="hsl(224.3 76.3% 48%)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {saveMessage && (
              <p className="text-sm text-muted-foreground">{saveMessage}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GenerateReport
