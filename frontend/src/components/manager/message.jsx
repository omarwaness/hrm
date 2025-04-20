import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { jwtDecode } from 'jwt-decode';

export default function Message() {
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: "" });

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const sender = decoded.email;
    const reciever = e.target.email.value;  // Keeping original spelling to match backend
    const content = e.target.content.value;

    try {
      const response = await fetch("http://localhost:5000/api/message/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sender, reciever, content }),  // Maintained original spelling
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setEmail("");
      setContent("");
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
          
          {/* Status Messages */}
          {status.type === 'success' && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              ✓ {status.message}
            </div>
          )}

          {status.type === 'error' && (
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
            <Button 
              type="submit" 
              className="w-full "
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
