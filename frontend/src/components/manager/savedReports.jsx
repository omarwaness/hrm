import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getAllReports } from "@/services/reportService"
import { Label } from "@/components/ui/label"  // Importing the Label component for first name and last name

function SavedReports() {
  const [reports, setReports] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports()
        setReports(data)
      } catch (err) {
        setError("Failed to load reports")
        console.error("Error fetching reports:", err)
      }
    }
    fetchReports()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
        Saved Reports
      </h2>
      <p className="text-base text-slate-600 dark:text-slate-200">
        Access your previously saved reports
      </p>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {reports.map((report, index) => (
        <Card key={index} className="w-full max-w-4xl mx-auto mb-6">
          <CardContent className="space-y-6">
            {/* Report Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">First Name</Label>
                <p className="font-medium">{report.employeeFirstName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Name</Label>
                <p className="font-medium">{report.employeeLastName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{report.employeeEmail}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Leave Requests</Label>
                <p className="font-medium">{report.totalRequests}</p>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.breakdown} barCategoryGap="20%">
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SavedReports
