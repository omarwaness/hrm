import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  StarOff,
  Paperclip,
  Trash,
  Bell,
  Mail,
  FileText  
} from "lucide-react"

export function InboxList({ 
  messages, 
  selectedMessage, 
  onSelectMessage, 
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

  // Function to get icon based on message type
  const getMessageTypeIcon = (type) => {
    switch (type) {
      case "message":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "notification":
        return <Bell className="h-4 w-4 text-amber-500" />;
      case "request":
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="divide-y">
      {messages.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No messages found</p>
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id}
            className={`flex items-start gap-2 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
              selectedMessage?.id === message.id ? 'bg-muted' : ''
            } ${!message.isRead ? 'font-medium' : ''}`}
            onClick={() => onSelectMessage(message)}
          >
            <div className="flex-shrink-0 mt-1">
              {getMessageTypeIcon(message.type)}
            </div>
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
              <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm truncate">
                  {message.sender.name}
                  {message.sender.department && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({message.sender.department})
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {message.date}
                </span>
              </div>
              <div className="text-sm font-medium">{message.subject}</div>
              <div className="text-xs text-muted-foreground truncate">
                {message.preview}
              </div>
              {(message.hasAttachments) && (
                <div className="flex items-center gap-1 mt-1">
                  {message.hasAttachments && (
                    <span className="inline-flex items-center text-xs text-muted-foreground">
                      <Paperclip className="h-3 w-3 mr-1" />
                      Attachment
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 pt-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onStarMessage(message.id);
                }}
              >
                {message.isStarred ? (
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                ) : (
                  <StarOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteMessage(message.id);
                }}
              >
                <Trash className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 