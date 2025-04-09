import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Star, 
  StarOff,
  Trash, 
  Reply, 
  Forward, 
  MoreHorizontal,
  Paperclip,
  Archive,
  Printer,
  Mail,
  Bell,
  FileText
} from "lucide-react"

export function InboxDetail({ 
  message, 
  onStarMessage,
  onDeleteMessage
}) {
  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Function to get the type badge
  const getTypeBadge = (type) => {
    switch (type) {
      case "message":
        return (
          <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50">
            <Mail className="mr-1 h-3 w-3" />
            Message
          </Badge>
        );
      case "notification":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
            <Bell className="mr-1 h-3 w-3" />
            Notification
          </Badge>
        );
      case "request":
        return (
          <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
            <FileText className="mr-1 h-3 w-3" />
            Request
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">{message.subject}</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onStarMessage(message.id)}
            >
              {message.isStarred ? (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDeleteMessage(message.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{message.sender.name}</p>
                <p className="text-sm text-muted-foreground">
                  {message.sender.department && <span>{message.sender.department} • </span>}
                  {message.date}
                </p>
              </div>
              {getTypeBadge(message.type)}
            </div>
          </div>
        </div>
      </div>

      {/* Message content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {message.content}
        </p>

        {message.hasAttachments && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Attachments</h3>
            <div className="bg-muted/50 rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded p-2 mr-3">
                  <Paperclip className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">document.pdf</p>
                  <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button className="gap-1">
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>
          <Button variant="outline" className="gap-1">
            <Forward className="h-4 w-4 mr-1" />
            Forward
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 