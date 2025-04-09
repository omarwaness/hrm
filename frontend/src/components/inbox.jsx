import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Archive, Trash2, X } from "lucide-react"

function MessageDetail({ message, onClose, onStar, onArchive, onDelete }) {
  if (!message) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-1/3 bg-background border-l shadow-lg transform transition-transform duration-200 ease-in-out">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Message Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{message.subject}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStar(message.id)}
                >
                  <Star
                    className={`h-5 w-5 ${
                      message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <p className="font-medium">From: {message.sender}</p>
                  <p className="text-sm text-muted-foreground">
                    Date: {message.date}
                  </p>
                </div>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">
                {message.preview}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end gap-2">
          <Button 
            variant="ghost"
            onClick={() => onArchive(message.id)}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button 
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(message.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function Inbox() {
  const [selectedMessage, setSelectedMessage] = useState(null)
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      subject: "Performance Review Update",
      sender: "HR Department",
      preview: "Your annual performance review is scheduled for next week. Please prepare your self-assessment and gather any relevant accomplishments from the past year.",
      date: "2024-03-15",
      isRead: false,
      isStarred: true,
      category: "Important",
      archived: false
    },
    {
      id: 2,
      subject: "Monthly Team Meeting",
      sender: "Team Lead",
      preview: "Join us for our monthly team sync this Friday at 2 PM. We'll be discussing project updates and upcoming initiatives.",
      date: "2024-03-14",
      isRead: true,
      isStarred: false,
      category: "Team",
      archived: false
    },
    {
      id: 3,
      subject: "New Benefits Package",
      sender: "Benefits Team",
      preview: "We're excited to announce updates to our benefits package. Please review the attached documents for important changes.",
      date: "2024-03-13",
      isRead: false,
      isStarred: false,
      category: "Benefits",
      archived: false
    },
    {
      id: 4,
      subject: "Quarterly Budget Review",
      sender: "Finance Department",
      preview: "Please review the attached Q1 budget report and submit any expense reports by the end of this week.",
      date: "2024-03-12",
      isRead: true,
      isStarred: true,
      category: "Finance",
      archived: false
    },
    {
      id: 5,
      subject: "Office Security Update",
      sender: "IT Security",
      preview: "Important updates to our security protocols. All employees must complete the security training by March 20th.",
      date: "2024-03-11",
      isRead: false,
      isStarred: false,
      category: "Security",
      archived: false
    },
    {
      id: 6,
      subject: "Company Holiday Schedule",
      sender: "HR Department",
      preview: "Updated holiday schedule for 2024. Please note the additional floating holidays added this year.",
      date: "2024-03-10",
      isRead: true,
      isStarred: false,
      category: "HR",
      archived: false
    },
    {
      id: 7,
      subject: "Project Milestone Achievement",
      sender: "Project Management",
      preview: "Congratulations team! We've successfully completed Phase 1 of the project ahead of schedule.",
      date: "2024-03-09",
      isRead: true,
      isStarred: true,
      category: "Projects",
      archived: false
    },
    {
      id: 8,
      subject: "Training Workshop Registration",
      sender: "Learning & Development",
      preview: "New professional development workshops available. Register now as spots are limited.",
      date: "2024-03-08",
      isRead: false,
      isStarred: false,
      category: "Training",
      archived: false
    },
    {
      id: 9,
      subject: "Office Maintenance Notice",
      sender: "Facilities Management",
      preview: "Scheduled maintenance work this weekend. Please ensure your workstation is cleared by Friday evening.",
      date: "2024-03-07",
      isRead: true,
      isStarred: false,
      category: "Facilities",
      archived: false
    },
    {
      id: 10,
      subject: "Health Insurance Updates",
      sender: "Benefits Team",
      preview: "Important changes to our health insurance coverage. Open enrollment period starts next month.",
      date: "2024-03-06",
      isRead: false,
      isStarred: true,
      category: "Benefits",
      archived: false
    },
    {
      id: 11,
      subject: "Team Building Event",
      sender: "Employee Experience",
      preview: "Save the date! Annual team building event scheduled for next month. Details and registration inside.",
      date: "2024-03-05",
      isRead: true,
      isStarred: false,
      category: "Events",
      archived: false
    },
    {
      id: 12,
      subject: "IT System Maintenance",
      sender: "IT Department",
      preview: "Scheduled system maintenance this Thursday night. Please save all work and log off by 6 PM.",
      date: "2024-03-04",
      isRead: false,
      isStarred: false,
      category: "IT",
      archived: false
    }
  ])

  const [filter, setFilter] = useState("all")

  const filteredMessages = messages.filter(message => {
    if (message.archived) return false
    if (filter === "all") return true
    if (filter === "unread") return !message.isRead
    if (filter === "starred") return message.isStarred
    return true
  })

  const toggleStar = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
    ))
  }

  const markAsRead = (message) => {
    if (!message.isRead) {
      setMessages(messages.map(msg => 
        msg.id === message.id ? { ...msg, isRead: true } : msg
      ))
    }
  }

  const archiveMessage = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, archived: true } : msg
    ))
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  const deleteMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id))
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  const handleMessageClick = (message) => {
    markAsRead(message)
    setSelectedMessage(message)
  }

  return (
    <div className={`container mx-auto max-w-5xl h-[calc(100vh-2rem)] transition-all duration-200 ${
      selectedMessage ? 'pr-[26vw]' : ''
    }`}>
      <div className="flex flex-col gap-4 p-4 h-full">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
            <p className="text-muted-foreground mt-1">
              Manage your messages and notifications
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="min-w-[80px]"
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              onClick={() => setFilter("unread")}
              className="min-w-[80px]"
            >
              Unread
            </Button>
            <Button
              variant={filter === "starred" ? "default" : "outline"}
              onClick={() => setFilter("starred")}
              className="min-w-[80px]"
            >
              Starred
            </Button>
          </div>
        </div>

        <Card className="shadow-sm flex-1 overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Messages ({filteredMessages.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-auto h-[calc(100%-4rem)]">
            {filteredMessages.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                No messages to display
              </div>
            ) : (
              <div className="divide-y">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`flex items-start space-x-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                      message.isRead ? 'bg-background' : 'bg-muted/30'
                    } ${selectedMessage?.id === message.id ? 'bg-muted' : ''}`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-0.5 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(message.id);
                      }}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                        }`}
                      />
                    </Button>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className={`font-medium truncate ${!message.isRead && 'font-semibold'}`}>
                            {message.subject}
                          </p>
                          {!message.isRead && (
                            <Badge variant="default" className="shrink-0">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">
                          {message.date}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground truncate">
                        {message.sender}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.preview}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveMessage(message.id);
                        }}
                        className="hover:bg-muted"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(message.id);
                        }}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MessageDetail
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onStar={toggleStar}
        onArchive={archiveMessage}
        onDelete={deleteMessage}
      />
    </div>
  )
}

export default Inbox
