"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import { getEmployeeContract } from "@/services/actions"  
import { Skeleton } from "@/components/ui/skeleton"

export default function ContractViewer() {
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch contract data immediately when component mounts
  useEffect(() => {
    async function loadContract() {
      try {
        const data = await getEmployeeContract()
        setContract(data)
      } catch (error) {
        console.error("Failed to fetch contract:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContract()
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Employee Contract
          </CardTitle>
          <CardDescription>Your employment contract details and terms</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-20 w-full mt-4" />
            </div>
          )}

          {contract && !loading && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
                  <p className="text-base">{contract.position}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Salary</h3>
                  <p className="text-base">{contract.salary}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                  <p className="text-base">{contract.startDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                  <p className="text-base">{contract.endDate}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Contract Terms</h3>
                <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-line">{contract.content}</div>
              </div>
            </div>
          )}
        </CardContent>
        {contract && !loading && (
          <CardFooter className="flex justify-end">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

