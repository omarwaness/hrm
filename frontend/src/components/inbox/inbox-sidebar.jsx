import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Inbox, 
  Star, 
  Mail, 
  Bell, 
  FileText, 
  AlertCircle,
  Trash,
  Archive,
  Send
} from "lucide-react"

export function InboxSidebar({ 
  selectedTab, 
  setSelectedTab,
  unreadCount,
  messageCount,
  notificationCount,
  requestCount
}) {
  const handleTabChange = (tab) => {
    setSelectedTab(tab)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main content - scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 px-2 py-1">
          <Button
            variant={selectedTab === "all" ? "secondary" : "ghost"}
            className="justify-start h-10 px-3"
            onClick={() => handleTabChange("all")}
          >
            <Inbox className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">All</span>
            <Badge variant="secondary" className="ml-auto">
              {unreadCount + messageCount + notificationCount + requestCount}
            </Badge>
          </Button>
          <Button
            variant={selectedTab === "unread" ? "secondary" : "ghost"}
            className="justify-start h-10 px-3"
            onClick={() => handleTabChange("unread")}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">Unread</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={selectedTab === "starred" ? "secondary" : "ghost"}
            className="justify-start h-10 px-3"
            onClick={() => handleTabChange("starred")}
          >
            <Star className="mr-2 h-4 w-4" />
            <span>Starred</span>
          </Button>
        </div>

        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Categories</h3>
        </div>
        <div className="flex flex-col gap-1 px-2 py-1">
          <Button
            variant={selectedTab === "message" ? "secondary" : "ghost"}
            className="justify-start h-10 px-3"
            onClick={() => handleTabChange("message")}
          >
            <Mail className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">Messages</span>
            {messageCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {messageCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={selectedTab === "notification" ? "secondary" : "ghost"}
            className="justify-start h-10 px-3"
            onClick={() => handleTabChange("notification")}
          >
            <Bell className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">Notifications</span>
            {notificationCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {notificationCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={selectedTab === "request" ? "secondary" : "ghost"}
            className="justify-start h-10 px-3"
            onClick={() => handleTabChange("request")}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">Requests</span>
            {requestCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {requestCount}
              </Badge>
            )}
          </Button>
        </div>

        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">System</h3>
        </div>
        <div className="flex flex-col gap-1 px-2 py-1">
          <Button
            variant="ghost"
            className="justify-start h-10 px-3"
          >
            <Send className="mr-2 h-4 w-4" />
            <span>Sent</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-10 px-3"
          >
            <Archive className="mr-2 h-4 w-4" />
            <span>Archived</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start h-10 px-3 text-muted-foreground"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Trash</span>
          </Button>
        </div>
      </div>
      
      {/* Fixed bottom compose button */}
      <div className="mt-2 px-4 py-3 border-t">
        <Button className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </div>
    </div>
  )
} 