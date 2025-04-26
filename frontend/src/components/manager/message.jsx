import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

export default function Message() {
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus({ type: "error", message: "User not authenticated" });
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      setStatus({ type: "error", message: "Invalid token" });
      return;
    }

    const userEmail = decoded.email;

    const socketIo = io("http://localhost:5001", {
      query: { email: userEmail },
      transports: ["websocket", "polling"],
    });

    socketIo.on("connect", () => {
      console.log("Connected to Socket.IO server on port 5001");
    });

    socketIo.on("message", (msg) => {
      console.log("Received socket message:", msg);
      if (msg.type === "NEW_MESSAGE") {
        setStatus({
          type: "success",
          message: `New message received from ${msg.payload.sender}`,
        });
      }
    });

    socketIo.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
      setStatus({ type: "error", message: "Real-time connection error" });
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");
      const decoded = jwtDecode(token);
      const sender = decoded.email;
      const receiver = e.target.email.value;
      const content = e.target.content.value;

      const response = await fetch("http://localhost:5000/api/message/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({ sender, receiver, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      if (socket) {
        socket.emit("newMessage", {
          sender,
          receiver,
          content,
        });
      }

      setStatus({ type: "success", message: "Message sent successfully!" });
      setEmail("");
      setContent("");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>

          {status.type === "success" && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              ✓ {status.message}
            </div>
          )}

          {status.type === "error" && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              ⚠ {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                Recipient Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="recipient@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm text-gray-600 mb-1">
                Message
              </label>
              <Textarea
                id="content"
                placeholder="Write your message..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} variant="default">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
