import React from "react"
import { Calendar, DollarSign, CheckCircle2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function JobDetails({
  title,
  salary,
  postedDate,
  description,
  requirements = [
    "5+ years of experience with React and modern JavaScript",
    "Experience with TypeScript and Next.js",
    "Strong understanding of web performance optimization",
    "Experience with responsive design and cross-browser compatibility",
    "Excellent problem-solving and communication skills",
  ],
  responsibilities = [
    "Build and maintain responsive web applications",
    "Collaborate with designers and backend developers",
    "Optimize applications for maximum speed and scalability",
    "Write clean, maintainable, and well-documented code",
    "Participate in code reviews and team discussions",
  ],
  isMobile = false,
  isOpen = false,
  onClose,
}) {
  const formattedDate = new Date(postedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const daysAgo = Math.floor((new Date().getTime() - new Date(postedDate).getTime()) / (1000 * 3600 * 24))
  const daysAgoText = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`

  const Content = () => (
    <>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Calendar className="h-4 w-4" />
        <span>
          Posted {daysAgoText} • {formattedDate}
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Job Description</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Requirements</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-1 text-primary" />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Responsibilities</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            {responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 mt-1 text-primary" />
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button className="w-full">Apply Now</Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="space-y-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <SheetTitle className="text-2xl font-bold">{title}</SheetTitle>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{salary}</span>
            </div>
          </SheetHeader>
          <div className="mt-6">
            <Content />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <DollarSign className="h-4 w-4" />
              <span>{salary}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            New
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Content />
      </CardContent>
    </Card>
  )
}