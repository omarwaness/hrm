import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar } from "lucide-react";

export default function JobOfferCard({ id, title, salary, description, daysAgoText, formattedDate, isSelected, onSelect }) {
  return (
    <button onClick={() => onSelect(id)} className="w-full text-left">
      <Card
        key={id || `job-${title}`}
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
  );
}
