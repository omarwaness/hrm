import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { InboxList } from "./inbox-list"
import { InboxDetail } from "./inbox-detail"
import { InboxSidebar } from "./inbox-sidebar"
import { 
  Bell, 
  Mail, 
  FileText, 
  Users,
  Calendar
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Mock data for inbox messages
const mockMessages = [
  {
    id: 1,
    type: "message",
    sender: {
      name: "Alex Johnson",
      avatar: "/avatars/alex.jpg",
      department: "HR"
    },
    subject: "Onboarding Documents",
    preview: "Please complete the attached onboarding documents...",
    content: "Please complete the attached onboarding documents by the end of the week. Let me know if you have any questions or need assistance.",
    date: "Today, 10:30 AM",
    isRead: false,
    hasAttachments: true,
    isStarred: true
  },
  {
    id: 2,
    type: "notification",
    sender: {
      name: "System",
      avatar: "/avatars/system.jpg",
      department: "System"
    },
    subject: "Upcoming Performance Review",
    preview: "Your annual performance review is scheduled for...",
    content: "Your annual performance review is scheduled for March 25, 2024 at 2:00 PM. Please prepare any relevant documents or information you'd like to discuss during the meeting.",
    date: "Yesterday, 4:15 PM",
    isRead: true,
    hasAttachments: false,
    isStarred: false
  },
  {
    id: 3,
    type: "request",
    sender: {
      name: "Sarah Williams",
      avatar: "/avatars/sarah.jpg",
      department: "Finance"
    },
    subject: "Expense Approval Required",
    preview: "Please review and approve the attached expense report...",
    content: "Please review and approve the attached expense report for the team building event. The total amount is $1,250. All receipts are included in the attachment.",
    date: "Mar 10, 2024",
    isRead: false,
    hasAttachments: true,
    isStarred: false
  },
  {
    id: 4,
    type: "message",
    sender: {
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      department: "Operations"
    },
    subject: "Updated Company Policies",
    preview: "Please review the updated company policies...",
    content: "Please review the updated company policies that will take effect next month. The main changes are related to remote work arrangements and security protocols. Let me know if you have any questions.",
    date: "Mar 8, 2024",
    isRead: true,
    hasAttachments: true,
    isStarred: true
  },
  {
    id: 5,
    type: "notification",
    sender: {
      name: "System",
      avatar: "/avatars/system.jpg",
      department: "System"
    },
    subject: "Password Expiration",
    preview: "Your password will expire in 7 days...",
    content: "Your password will expire in 7 days. Please change your password before the expiration date to avoid any access issues. You can change your password in the account settings.",
    date: "Mar 7, 2024",
    isRead: true,
    hasAttachments: false,
    isStarred: false
  }
];

export function InboxComponent() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [messages, setMessages] = useState(mockMessages)

  const handleMessageSelect = (message) => {
    setSelectedMessage(message)
    
    // Mark message as read
    if (!message.isRead) {
      setMessages(messages.map(msg => 
        msg.id === message.id ? { ...msg, isRead: true } : msg
      ))
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleStarMessage = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ))
  }

  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter(msg => msg.id !== messageId))
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage(null)
    }
  }

  // Filter messages based on the selected tab and search query
  const filteredMessages = messages.filter(message => {
    const matchesTab = 
      selectedTab === "all" || 
      (selectedTab === "unread" && !message.isRead) ||
      (selectedTab === "starred" && message.isStarred) ||
      selectedTab === message.type;
    
    const matchesSearch = 
      searchQuery === "" || 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Calculate counts for badges
  const unreadCount = messages.filter(msg => !msg.isRead).length;
  const messageCount = messages.filter(msg => msg.type === "message").length;
  const notificationCount = messages.filter(msg => msg.type === "notification").length;
  const requestCount = messages.filter(msg => msg.type === "request").length;

  return (
    <div className="flex gap-4 h-[calc(100vh-var(--header-height)-10rem)]">
      {/* Left sidebar with folders/categories */}
      <Card className="w-64 h-full flex flex-col">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-md">Folders</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <InboxSidebar 
            selectedTab={selectedTab} 
            setSelectedTab={setSelectedTab}
            unreadCount={unreadCount}
            messageCount={messageCount}
            notificationCount={notificationCount}
            requestCount={requestCount}
          />
        </CardContent>
      </Card>
      
      {/* Middle panel with message list */}
      <Card className="flex-1 min-w-96 h-full flex flex-col">
        <CardHeader className="px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md">
              {selectedTab === 'all' && 'All Messages'}
              {selectedTab === 'unread' && 'Unread Messages'}
              {selectedTab === 'starred' && 'Starred Messages'}
              {selectedTab === 'message' && 'Messages'}
              {selectedTab === 'notification' && 'Notifications'}
              {selectedTab === 'request' && 'Requests'}
            </CardTitle>
            <div className="text-sm text-muted-foreground">{filteredMessages.length} messages</div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Input 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={handleSearch}
              className="h-9"
            />
            <Button size="sm" variant="ghost" className="px-3 h-9">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M3 9H12M5.5 5.5H9.5M4.5 12.5H10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          <InboxList 
            messages={filteredMessages} 
            selectedMessage={selectedMessage}
            onSelectMessage={handleMessageSelect}
            onStarMessage={handleStarMessage}
            onDeleteMessage={handleDeleteMessage}
          />
        </CardContent>
      </Card>
      
      {/* Right panel with message details */}
      <Card className="w-1/2 h-full flex flex-col">
        <CardContent className="flex-1 p-0 flex flex-col">
          {selectedMessage ? (
            <InboxDetail 
              message={selectedMessage} 
              onStarMessage={handleStarMessage}
              onDeleteMessage={handleDeleteMessage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Mail className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No message selected</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Select a message from the list to view its contents
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 