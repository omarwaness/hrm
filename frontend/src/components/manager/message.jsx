import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {jwtDecode} from 'jwt-decode'
export default function Message() {
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const decoded = jwtDecode(token);
    const sender= decoded.email;
    const reciever=e.target.email.value;
    const content=e.target.content.value;
    console.log(content)
    
  
    try {
      const response = await fetch("http://localhost:5000/api/message/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({sender, reciever, content }),
      });
    
      if (!response.ok) {

        const errorData = await response.json();
        alert(`Error: ${errorData.message || response.statusText}`);
        return;
      }
  
      const data = await response.json();
      console.log("Message submitted:", data);
  
    } catch (err) {
      alert(`Network error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
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
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
