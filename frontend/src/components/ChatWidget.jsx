// ChatWidget.jsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SendHorizonal, MessageCircle, X } from "lucide-react";
import { askAI } from "../services/chatServices";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (message.trim() === "") return;

    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    const response = await askAI(message);
    const botMessage = { sender: "bot", text: response };
    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button className="rounded-full p-3 shadow-lg" size="icon" onClick={toggleChat}>
        <MessageCircle className="w-5 h-5" />
      </Button>

      {isOpen && (
        <Card className="w-80 h-[28rem] flex flex-col justify-between mt-2 shadow-2xl rounded-2xl">
          <CardHeader className="border-b flex justify-between items-center">
            <CardTitle className="text-lg">AI Chat</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-7 w-7">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-xl max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-primary text-white ml-auto"
                    : "bg-muted text-muted-foreground mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-muted text-muted-foreground p-2 rounded-xl max-w-[80%] mr-auto italic">
                Thinking...
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={handleSend} size="icon" disabled={loading}>
              <SendHorizonal className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
