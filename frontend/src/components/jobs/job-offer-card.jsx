import React from "react"
import { Calendar, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function JobOfferCard({
  id = "1",
  title = "Senior Frontend Developer",
  salary = "$120,000 - $150,000",
  postedDate = "2025-03-01",
  description = "We're looking for an experienced Frontend Developer to join our team. You'll be responsible for building responsive web applications using React and Next.js.",
  isSelected = false,
  onSelect,
}) {
  const formattedDate = new Date(postedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const daysAgo = Math.floor((new Date().getTime() - new Date(postedDate).getTime()) / (1000 * 3600 * 24))
  const daysAgoText = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`

  return (
    <button onClick={() => onSelect(id)} className="w-full text-left">
      <Card
        className={`w-full transition-all duration-200 hover:shadow-md cursor-pointer ${
          isSelected ? "border-primary" : "hover:border-primary/50"
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              New
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <DollarSign className="h-4 w-4" />
            <span>{salary}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>
              Posted {daysAgoText} • {formattedDate}
            </span>
          </div>
          <p className="text-sm line-clamp-2">{description}</p>
          <div className="mt-4">
            <Badge variant="secondary">Full-time</Badge>
          </div>
        </CardContent>
      </Card>
    </button>
  )
}