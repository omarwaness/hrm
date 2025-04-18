import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, StarOff, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { jwtDecode } from 'jwt-decode';
import Loading from "./Loading";
export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [openMessageId, setOpenMessageId] = useState(null);
  const [filter, setFilter] = useState("all"); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const initialMessages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. User not authenticated.");
      }

      const decode = jwtDecode(token);
      const email = decode.email;

      const res = await fetch(`http://localhost:5000/api/message/${email}`);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Received data:", data);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.message || "Failed to load messages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialMessages();
  }, []);

  const toggleMessage = (id) => {
    setOpenMessageId(openMessageId === id ? null : id);
  };

  const toggleFavorite = (id) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === id ? { ...msg, favorite: !msg.favorite } : msg
      )
    );
  };

  const deleteMessage = async (id) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== id));
    try{
      const res=await fetch(`http://localhost:5000/api/message/${id}`,{
        method:'DELETE'
      })
    }catch(err){
      alert(err)
    }
  };

  const filteredMessages =
    filter === "starred"
      ? messages.filter((msg) => msg.favorite)
      : messages;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 space-y-4">
     
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

      
      <Separator />

      
      <div className="space-y-3">
        {filteredMessages.map((msg) => (
          <Card
            key={msg._id}
            className="cursor-pointer hover:shadow-md transition"
          >
            <CardContent
              className="p-4 space-y-2"
              onClick={() => toggleMessage(msg._id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {msg.sender}: {msg.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(msg._id)}
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
                    onClick={() => deleteMessage(msg._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              {openMessageId === msg._id && (
                <p className="text-sm text-gray-600">{msg.content}</p>
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
