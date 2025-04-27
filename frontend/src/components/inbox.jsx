"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns"; // Using date-fns
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Star, Trash2, Mail, MailOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import Loading from "./Loading"; // Assuming Loading component exists
import { useNotifications } from "./site-header"; // Keep existing context import
import { cn } from "@/lib/utils";

// Define notification sound data (ensure this works or replace with a valid source)
const notificationSoundData = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU" + Array(20).fill("A").join("");

export default function Inbox() {
    const [messages, setMessages] = useState([]);
    const [openMessageId, setOpenMessageId] = useState(null);
    const [filter, setFilter] = useState("all"); // 'all' or 'starred'
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const socket = useRef(null);
    const messagesRef = useRef(new Set()); // Tracks IDs to prevent duplicates
    const notificationSound = useRef(null);

    // Notification context
    const { setUnreadCount, setHasNewMessage } = useNotifications();

    // Initialize Audio only once on the client-side
    useEffect(() => {
        if (typeof window !== "undefined") {
            notificationSound.current = new Audio(notificationSoundData);
        }
    }, []);

    // Fetch initial messages and connect WebSocket
    useEffect(() => {
        const fetchMessagesAndConnect = async () => {
            console.log("Inbox: Starting fetchMessagesAndConnect");
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Authentication required.");

                const { email } = jwtDecode(token);
                console.log(`Inbox: User email decoded: ${email}`);

                // Fetch messages
                console.log("Inbox: Fetching initial messages...");
                const res = await fetch(`http://localhost:5000/api/message/${email}`, {
                    headers: { "Authorization": `Bearer ${token}` },
                    credentials: "include"
                });

                if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status} ${res.statusText}`);

                const data = await res.json();
                console.log(`Inbox: Fetched ${data.length} messages initially.`);

                const uniqueMessages = [];
                messagesRef.current.clear(); // Clear ref before processing fetch results
                data.forEach(msg => {
                    if (!messagesRef.current.has(msg._id)) {
                        messagesRef.current.add(msg._id);
                        uniqueMessages.push(msg);
                    } else {
                         console.warn(`Inbox Fetch: Duplicate message ID ${msg._id} found in initial data, skipping.`);
                    }
                });
                console.log(`Inbox: Processed fetch, ${uniqueMessages.length} unique messages identified.`);

                const unread = uniqueMessages.filter(msg => !msg.read).length;
                setUnreadCount(unread);
                setMessages(uniqueMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort messages newest first

                // Connect to Socket.IO
                console.log("Inbox: Connecting to Socket.IO server...");
                socket.current = io("http://localhost:5001", {
                    query: { email },
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000
                });

                socket.current.on("connect", () => {
                     console.log("Inbox: Socket.IO connected successfully.");
                });

                // Socket event handlers
                socket.current.on("message", (message) => {
                    console.log(`Inbox: Received socket message - Type: ${message.type}, Payload ID: ${message.payload?._id || message.payload}`);
                    switch (message.type) {
                        case "NEW_MESSAGE":
                            const newMessage = message.payload;
                            console.log(`Socket received NEW_MESSAGE: ${newMessage._id}`);

                            // --- Initial check using messagesRef to potentially avoid unnecessary side effects ---
                            if (!messagesRef.current.has(newMessage._id)) {
                                console.log(`Message ${newMessage._id} not found in messagesRef. Proceeding to update state.`);

                                // --- Use setMessages with functional update and internal check ---
                                setMessages((prevMessages) => {
                                    // **Crucial Check:** Verify if the ID already exists in the *current state*
                                    if (prevMessages.some(msg => msg._id === newMessage._id)) {
                                        console.warn(`Duplicate Prevention: Message ${newMessage._id} already found in state. Skipping add.`);
                                        // Ensure the ref is consistent if the state already had it somehow
                                         if (!messagesRef.current.has(newMessage._id)) {
                                             messagesRef.current.add(newMessage._id);
                                         }
                                        return prevMessages; // Return the existing state without adding
                                    } else {
                                        // If truly new to the state array, add it and update the ref
                                        console.log(`Adding message ${newMessage._id} to state.`);
                                        messagesRef.current.add(newMessage._id); // Add ID to ref *only when adding to state*
                                        return [newMessage, ...prevMessages]
                                                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Add and sort
                                    }
                                });

                                // --- Side effects only if the message was intended to be added (based on initial ref check) ---
                                // These might still run even if the internal state check prevents addition due to timing.
                                setUnreadCount(prev => prev + 1);
                                setHasNewMessage(true);
                                notificationSound.current?.play().catch(e => console.error("Audio play failed:", e));
                                // Show toast...
                                toast.custom((t) => (
                                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                                        <div className="flex-1 w-0 p-4">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 pt-0.5">
                                                    <Mail className="h-10 w-10 text-blue-500" />
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {newMessage.sender}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {newMessage.subject || newMessage.content.substring(0, 30)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex border-l border-gray-200">
                                            <button
                                                onClick={() => toast.dismiss(t.id)}
                                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                                            >
                                                Fermer
                                            </button>
                                        </div>
                                    </div>
                                ), { duration: 5000 });

                            } else {
                                // This message ID was already known by the ref set
                                console.log(`Ignoring socket event for known message ${newMessage._id} based on messagesRef.`);
                            }
                            break; // End NEW_MESSAGE case

                        case "MESSAGE_UPDATED":
                             console.log(`Socket received MESSAGE_UPDATED: ${message.payload._id}`);
                            setMessages((prev) => {
                                 const updated = prev.map((msg) =>
                                    msg._id === message.payload._id ? message.payload : msg
                                 );
                                 // Recalculate unread count after potential update
                                 const newUnreadCount = updated.filter(m => !m.read).length;
                                 setUnreadCount(newUnreadCount);
                                 return updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                             });
                            break;

                        case "MESSAGE_DELETED":
                             const deletedId = message.payload;
                             console.log(`Socket received MESSAGE_DELETED: ${deletedId}`);
                             // Use functional update form to ensure we operate on the latest state
                             setMessages((prevMessages) => {
                                 const messageExists = prevMessages.some(msg => msg._id === deletedId);
                                 if (!messageExists) {
                                      console.warn(`Message deletion requested for ${deletedId}, but it was not found in current state.`);
                                      return prevMessages; // No change needed
                                 }

                                 const deletedMsg = prevMessages.find(msg => msg._id === deletedId);
                                 if (deletedMsg && !deletedMsg.read) {
                                     setUnreadCount(prev => Math.max(0, prev - 1));
                                 }
                                 messagesRef.current.delete(deletedId); // Remove from tracking set
                                 return prevMessages.filter((msg) => msg._id !== deletedId);
                             });
                            break;
                        default:
                             console.warn(`Inbox: Received unknown socket message type: ${message.type}`);
                            break;
                    }
                });

                socket.current.on("connect_error", (err) => {
                    console.error("Inbox: Socket.IO connection error:", err);
                    setError(`Real-time connection failed: ${err.message}. Try refreshing.`);
                    toast.error("Real-time connection failed.");
                });

                socket.current.on("disconnect", (reason) => {
                     console.log(`Inbox: Socket.IO disconnected. Reason: ${reason}`);
                     if (reason === "io server disconnect") {
                         // the disconnection was initiated by the server, you need to reconnect manually
                         // socket.current.connect(); // Optional: auto-reconnect on server disconnect
                     }
                     // else the socket will automatically try to reconnect
                });


            } catch (err) {
                console.error("Inbox: Error during initial fetch or setup:", err);
                setError(err.message || "An error occurred while loading messages.");
                toast.error(err.message || "Failed to load messages.");
            } finally {
                console.log("Inbox: fetchMessagesAndConnect finished.");
                setIsLoading(false);
            }
        };

        fetchMessagesAndConnect();

        // Cleanup socket connection on unmount
        return () => {
             if (socket.current) {
                 console.log("Inbox: Disconnecting Socket.IO on component unmount.");
                 socket.current.disconnect();
             }
        };
    }, [setUnreadCount, setHasNewMessage]); // Dependencies for context usage

    // Toggle message read state and expand/collapse
    const toggleMessage = async (id) => {
        const message = messages.find(msg => msg._id === id);
        const isOpening = openMessageId !== id;
        setOpenMessageId(isOpening ? id : null);

        if (message && !message.read && isOpening) {
            console.log(`Inbox: Marking message ${id} as read.`);
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found");

                // Optimistic UI update
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === id ? { ...msg, read: true } : msg
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));

                // API call to mark as read
                const res = await fetch(`http://localhost:5000/api/message/${id}/read`, {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${token}` },
                    credentials: "include"
                });

                if (!res.ok) throw new Error(`Failed to mark message ${id} as read: ${res.statusText}`);
                console.log(`Inbox: Message ${id} successfully marked as read via API.`);

            } catch (err) {
                console.error(`Inbox: Error marking message ${id} as read:`, err);
                toast.error("Failed to mark message as read. Reverting.");
                 // Revert optimistic update on failure
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === id ? { ...msg, read: false } : msg
                    )
                );
                setUnreadCount(prev => prev + 1);
            }
        }
    };

    // Toggle message favorite state
    const toggleFavorite = async (id, e) => {
        e.stopPropagation(); // Prevent toggleMessage from firing
        console.log(`Inbox: Toggling favorite status for message ${id}.`);
         const originalMessages = [...messages];
         const messageIndex = messages.findIndex(msg => msg._id === id);
         if (messageIndex === -1) {
             console.error(`Inbox: Cannot toggle favorite, message ${id} not found.`);
             return;
         }

         const updatedMessage = { ...messages[messageIndex], favorite: !messages[messageIndex].favorite };
         const newMessages = [...messages];
         newMessages[messageIndex] = updatedMessage;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            // Optimistic UI update
            setMessages(newMessages);

            // API call
            const res = await fetch(`http://localhost:5000/api/message/${id}/starred`, {
                method: "PUT",
                 headers: {
                     "Content-Type": "application/json",
                     "Authorization": `Bearer ${token}`
                 },
                credentials: "include",
            });

            if (!res.ok) throw new Error(`Failed to update favorite status for ${id}: ${res.statusText}`);
            console.log(`Inbox: Message ${id} favorite status updated successfully via API.`);
            toast.success(`Message ${updatedMessage.favorite ? 'starred' : 'unstarred'}`);

        } catch (err) {
            console.error(`Inbox: Error toggling favorite for message ${id}:`, err);
            toast.error("Failed to update favorite status.");
            // Revert optimistic update on failure
            setMessages(originalMessages);
        }
    };

    // Show delete confirmation dialog
    const confirmDeleteMessage = (id, e) => {
        e.stopPropagation(); // Prevent toggleMessage from firing
        console.log(`Inbox: Requesting delete confirmation for message ${id}.`);
        setMessageToDelete(id);
        setShowDeleteConfirm(true);
    };

    // Hide delete confirmation dialog
    const handleDeleteCancel = () => {
        console.log("Inbox: Delete cancelled.");
        setShowDeleteConfirm(false);
        setMessageToDelete(null);
    };

    // Delete message action
    const deleteMessage = async () => {
         if (!messageToDelete) return;
         console.log(`Inbox: Proceeding with delete for message ${messageToDelete}.`);

         const originalMessages = [...messages];
         const messageToBeDeleted = messages.find(msg => msg._id === messageToDelete);
         const wasUnread = messageToBeDeleted && !messageToBeDeleted.read;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            // Optimistic UI update
            setMessages((prev) => prev.filter((msg) => msg._id !== messageToDelete));
            messagesRef.current.delete(messageToDelete);
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            setShowDeleteConfirm(false); // Close modal optimistically

            // API call
            const res = await fetch(`http://localhost:5000/api/message/${messageToDelete}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
                credentials: "include"
            });

            if (!res.ok) throw new Error(`Delete failed for ${messageToDelete}: ${res.statusText}`);

            console.log(`Inbox: Message ${messageToDelete} deleted successfully via API.`);
            toast.success("Message deleted successfully.");
            setMessageToDelete(null); // Clear ID after successful deletion

        } catch (err) {
            console.error(`Inbox: Error deleting message ${messageToDelete}:`, err);
            toast.error("Failed to delete message.");
            // Revert optimistic update on failure
            setMessages(originalMessages);
            if (wasUnread) {
                setUnreadCount(prev => prev + 1);
            }
            // Ensure ref is consistent if deletion failed
            if (!messagesRef.current.has(messageToDelete) && messageToBeDeleted) {
                 messagesRef.current.add(messageToDelete);
            }
            setShowDeleteConfirm(false); // Still close modal on error
            setMessageToDelete(null);
        }
    };

    // Filter messages based on state
    const filteredMessages = messages.filter((msg) => {
        if (filter === "starred") {
            return msg.favorite;
        }
        return true; // 'all' filter
    });

    // Date Formatter using date-fns
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "PPp"); // Format: Apr 26, 2025, 5:00:49 PM
        } catch (e) {
            console.error("Inbox: Date formatting error:", e);
            return "Invalid Date";
        }
    };

    // Render Loading state
    if (isLoading) return <Loading />;

    // Render Error state (Styled similarly to LeaveRequest status message)
    if (error && messages.length === 0) { // Only show full error if no messages loaded
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="rounded-md bg-destructive/10 text-destructive px-4 py-3 text-center font-medium shadow max-w-md border border-destructive/30">
                    <p className="font-bold mb-2">Error Loading Inbox</p>
                    <p className="text-sm">{error}</p>
                     <Button variant="outline" size="sm" className="mt-4 border-destructive/50 text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // Main component render
    return (
        <div className="flex min-h-screen flex-col p-4">
            <div className="mx-auto w-full max-w-5xl space-y-6 py-10">
                {/* Centered Header */}
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Your Inbox</h1>
                    <p className="text-muted-foreground">
                        Messages update in real-time. {error ? `(Connection issue: ${error})` : ''}
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2">
                     <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("all")}
                    >
                        <MailOpen className="mr-2 h-4 w-4" />
                        All Messages
                        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                            {messages.length}
                        </span>
                    </Button>
                    <Button
                        variant={filter === "starred" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("starred")}
                    >
                        <Star className="mr-2 h-4 w-4" />
                        Starred
                        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                            {messages.filter(msg => msg.favorite).length}
                        </span>
                    </Button>
                </div>

                {/* Main Content Card */}
                <Card>
                    <CardContent className="p-0">
                        {filteredMessages.length === 0 ? (
                            <div className="p-10 text-center text-muted-foreground">
                                <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                No messages found in this view.
                            </div>
                        ) : (
                            <div className="divide-y divide-border"> {/* Use divide for separators */}
                                {filteredMessages.map((msg) => (
                                    // Using div instead of Fragment for simpler structure if needed
                                    <div key={msg._id}>
                                        <div
                                            className={cn(
                                                "p-4 flex items-start gap-4 cursor-pointer transition-colors hover:bg-muted/50",
                                                !msg.read && "bg-blue-500/10", // Subtle background for unread
                                                openMessageId === msg._id && "bg-muted" // Background when open
                                            )}
                                            onClick={() => toggleMessage(msg._id)}
                                        >
                                             {/* Icon indicator */}
                                             <div className="flex-shrink-0 pt-1">
                                                 {openMessageId === msg._id ?
                                                     <MailOpen className="h-5 w-5 text-primary" /> :
                                                     <Mail className={cn("h-5 w-5", !msg.read ? 'text-primary' : 'text-muted-foreground')} />
                                                 }
                                             </div>

                                            {/* Message Details */}
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-baseline justify-between">
                                                    <p className={cn(
                                                        "text-sm font-medium truncate",
                                                        !msg.read && "font-bold text-foreground",
                                                        openMessageId === msg._id && "text-primary"
                                                    )}>
                                                        {msg.sender}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2 whitespace-nowrap">
                                                        {formatDate(msg.createdAt)}
                                                    </span>
                                                </div>
                                                {msg.subject && (
                                                    <p className={cn(
                                                        "text-sm mt-1 truncate",
                                                        !msg.read && "text-foreground",
                                                        openMessageId === msg._id && "font-medium"
                                                    )}>
                                                        {msg.subject}
                                                    </p>
                                                )}
                                                {openMessageId !== msg._id && (
                                                    <p className="text-xs text-muted-foreground truncate mt-1">
                                                        {msg.content.substring(0, 100)}...
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => toggleFavorite(msg._id, e)}
                                                    className={cn("h-8 w-8 rounded-full", msg.favorite ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10" : "text-muted-foreground hover:text-foreground hover:bg-accent")}
                                                    aria-label={msg.favorite ? "Unstar message" : "Star message"}
                                                >
                                                    <Star className={cn("h-4 w-4", msg.favorite && "fill-current")} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => confirmDeleteMessage(msg._id, e)}
                                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    aria-label="Delete message"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {openMessageId === msg._id && (
                                            <div className="p-4 pt-2 pl-12 bg-muted border-t border-border">
                                                <div className="mb-2 p-2 bg-background rounded text-xs text-muted-foreground border">
                                                    <strong>From:</strong> {msg.sender} <br/>
                                                    <strong>To:</strong> {msg.receiver} <br/>
                                                    <strong>Date:</strong> {formatDate(msg.createdAt)}
                                                </div>
                                                <div className="whitespace-pre-wrap text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                                                    {msg.content}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog using shadcn/ui */}
                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
                             <AlertDialogAction
                                 onClick={deleteMessage}
                                 className={buttonVariants({ variant: "destructive" })}
                             >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}