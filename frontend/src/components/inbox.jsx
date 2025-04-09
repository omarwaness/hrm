import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, StarOff, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const initialMessages = [
  {
    id: 1,
    sender: "Alice",
    subject: "Hello!",
    message: "Hey, how are you doing today?",
    date: "2025-04-09",
    favorite: false,
  },
  {
    id: 2,
    sender: "Bob",
    subject: "Reminder",
    message: "Don't forget the team meeting at 3 PM.",
    date: "2025-04-08",
    favorite: true,
  },
  {
    id: 3,
    sender: "Charlie",
    subject: "Catch up",
    message: "Let's grab lunch this week.",
    date: "2025-04-07",
    favorite: false,
  },
];

export default function Inbox() {
  const [messages, setMessages] = useState(initialMessages);
  const [openMessageId, setOpenMessageId] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" or "starred"

  const toggleMessage = (id) => {
    setOpenMessageId(openMessageId === id ? null : id);
  };

  const toggleFavorite = (id) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, favorite: !msg.favorite } : msg
      )
    );
  };

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const filteredMessages =
    filter === "starred"
      ? messages.filter((msg) => msg.favorite)
      : messages;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Inbox</h1>
        <p className="text-sm text-muted-foreground">
          Manage your inbox and notifications
        </p>
        <div className="mt-3 flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "starred" ? "default" : "outline"}
            onClick={() => setFilter("starred")}
          >
            Starred
          </Button>
        </div>
      </div>

      {/* Divider */}
      <Separator />

      {/* Message list */}
      <div className="space-y-3">
        {filteredMessages.map((msg) => (
          <Card
            key={msg.id}
            className="cursor-pointer hover:shadow-md transition"
          >
            <CardContent
              className="p-4 space-y-2"
              onClick={() => toggleMessage(msg.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {msg.sender}: {msg.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">{msg.date}</p>
                </div>
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(msg.id)}
                  >
                    {msg.favorite ? (
                      <Star className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMessage(msg.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              {openMessageId === msg.id && (
                <p className="text-sm text-gray-600">{msg.message}</p>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredMessages.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages found.</p>
        )}
      </div>
    </div>
  );
}
