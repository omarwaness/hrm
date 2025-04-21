import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, StarOff, Trash2, Mail, MailOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { jwtDecode } from "jwt-decode";
import Loading from "./Loading";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useNotifications } from "./site-header"; // Importez le contexte

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [openMessageId, setOpenMessageId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const socket = useRef(null);
  const messagesRef = useRef(new Set()); // Pour suivre les IDs de messages et éviter les doublons
  const notificationSound = useRef(new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"+
  Array(20).fill("A").join(""))); // Simple beep
  
  // Utiliser le contexte de notification
  const { setUnreadCount, setHasNewMessage } = useNotifications();

  useEffect(() => {
    const fetchMessagesAndConnect = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const { email } = jwtDecode(token);

        // Récupérer les messages depuis l'API REST où l'utilisateur est le destinataire
        const res = await fetch(`http://localhost:5000/api/message/${email}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });
        
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log("Fetched messages:", data);
        
        // S'assurer qu'il n'y a pas de messages dupliqués en utilisant un Set d'IDs
        const uniqueMessages = [];
        messagesRef.current.clear(); // Réinitialiser le Set
        
        data.forEach(msg => {
          if (!messagesRef.current.has(msg._id)) {
            messagesRef.current.add(msg._id);
            uniqueMessages.push(msg);
          }
        });
        
        // Compter les messages non lus
        const unread = uniqueMessages.filter(msg => !msg.read).length;
        setUnreadCount(unread); // Mettre à jour le contexte
        setMessages(uniqueMessages);

        // Se connecter au serveur Socket.IO sur le port 5001
        socket.current = io("http://localhost:5001", {
          query: { email },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        socket.current.on("message", (message) => {
          console.log("Received socket message:", message);
          switch (message.type) {
            case "NEW_MESSAGE":
              // Vérifier si le message existe déjà
              if (!messagesRef.current.has(message.payload._id)) {
                messagesRef.current.add(message.payload._id);
                
                setMessages((prev) => {
                  // Double vérification pour éviter les doublons
                  const exists = prev.some(msg => msg._id === message.payload._id);
                  if (exists) return prev;
                  return [message.payload, ...prev];
                });
                
                // Mettre à jour le compteur de messages non lus
                setUnreadCount(prev => prev + 1);
                setHasNewMessage(true);
                
                // Jouer le son de notification
                notificationSound.current.play().catch(e => console.error("Failed to play notification:", e));
                
                // Afficher une notification toast
                toast.custom((t) => (
                  <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                    <div className="flex-1 w-0 p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <Mail className="h-10 w-10 text-blue-500" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {message.payload.sender}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {message.payload.subject || message.payload.content.substring(0, 30)}
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
              }
              break;
            case "MESSAGE_UPDATED":
              setMessages((prev) =>
                prev.map((msg) =>
                  msg._id === message.payload._id ? message.payload : msg
                )
              );
              break;
            case "MESSAGE_DELETED":
              // Mettre à jour le compteur si le message supprimé était non lu
              const deletedMessage = messages.find(msg => msg._id === message.payload);
              if (deletedMessage && !deletedMessage.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
              }
              
              setMessages((prev) =>
                prev.filter((msg) => msg._id !== message.payload)
              );
              messagesRef.current.delete(message.payload);
              break;
            default:
              break;
          }
        });

        socket.current.on("connect_error", (err) => {
          console.error("Socket.IO connection error:", err);
          setError("Real-time connection error");
        });
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessagesAndConnect();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [setUnreadCount, setHasNewMessage]);

  const toggleMessage = async (id) => {
    setOpenMessageId((prev) => (prev === id ? null : id));
    
    // Marquer comme lu lors de l'ouverture
    const message = messages.find(msg => msg._id === id);
    if (message && !message.read) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === id ? { ...msg, read: true } : msg
          )
        );
        
        // Mettre à jour le compteur de messages non lus
        setUnreadCount(prev => Math.max(0, prev - 1));

        const res = await fetch(`http://localhost:5000/api/message/${id}/read`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });

        if (!res.ok) throw new Error("Update failed");
      } catch (err) {
        console.error(err);
        toast.error("Impossible de marquer le message comme lu");
      }
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, favorite: !msg.favorite } : msg
        )
      );

      const res = await fetch(`http://localhost:5000/api/message/${id}/starred`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de mettre à jour le statut favori");
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, favorite: !msg.favorite } : msg
        )
      );
    }
  };

  const confirmDeleteMessage = (id) => {
    setMessageToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  const deleteMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Vérifier si le message à supprimer était non lu
      const messageToBeDeleted = messages.find(msg => msg._id === messageToDelete);
      const wasUnread = messageToBeDeleted && !messageToBeDeleted.read;
      
      setMessages((prev) => prev.filter((msg) => msg._id !== messageToDelete));
      messagesRef.current.delete(messageToDelete); // Supprimer du Set de suivi
      
      // Mettre à jour le compteur si le message était non lu
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setShowDeleteConfirm(false);
      setMessageToDelete(null);

      const res = await fetch(`http://localhost:5000/api/message/${messageToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Message supprimé");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de supprimer le message");
      window.location.reload();
    }
  };

  const filteredMessages =
    filter === "starred" ? messages.filter((msg) => msg.favorite) : messages;

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600 font-semibold text-center mx-auto max-w-3xl mt-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl">Error</span>
          <p>{error}</p>
        </div>
      </div>
    );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Si même jour, afficher uniquement l'heure
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Si dans la semaine dernière, afficher le nom du jour et l'heure
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (date > weekAgo) {
      return date.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Sinon afficher la date complète
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Real-Time Inbox
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Messages update instantly via WebSocket connection
        </p>

        {/* Boutons de filtre simples */}
        <div className="flex gap-2 mb-4">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="flex items-center gap-2 text-base py-2 px-4"
          >
            <MailOpen className="h-5 w-5" />
            <span>All Messages</span>
            <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full text-xs">
              {messages.length}
            </span>
          </Button>
          <Button 
            variant={filter === "starred" ? "default" : "outline"}
            onClick={() => setFilter("starred")}
            className="flex items-center gap-2 text-base py-2 px-4"
          >
            <Star className="h-5 w-5" />
            <span>Starred</span>
            <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full text-xs">
              {messages.filter(msg => msg.favorite).length}
            </span>
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        {filteredMessages.length === 0 && (
          <div className="p-12 text-center bg-gray-50 rounded-lg">
            <Mail className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No messages found</p>
          </div>
        )}

        {filteredMessages.map((msg) => (
          <Card 
            key={msg._id} 
            className={`transition ${!msg.read ? 'border-l-4 border-l-blue-500' : ''} ${msg.favorite ? 'border-r-4 border-r-yellow-400' : ''} ${openMessageId === msg._id ? 'shadow-md bg-blue-50' : 'hover:shadow-md'}`}
          >
            <CardContent className="p-0">
              <div 
                className={`p-5 cursor-pointer flex items-start justify-between gap-4 ${!msg.read ? 'bg-blue-50 bg-opacity-50' : ''}`}
                onClick={() => toggleMessage(msg._id)}
              >
                <div className="flex items-center gap-4 flex-grow">
                  {openMessageId === msg._id ? 
                    <MailOpen className="h-6 w-6 text-blue-500 flex-shrink-0" /> : 
                    <Mail className={`h-6 w-6 flex-shrink-0 ${!msg.read ? 'text-blue-500' : 'text-gray-400'}`} />
                  }
                  <div className="flex-grow">
                    <div className="flex items-baseline justify-between mb-2">
                      <p className={`font-medium text-lg ${!msg.read ? 'font-bold text-blue-800' : ''} ${openMessageId === msg._id ? 'text-blue-700' : ''}`}>
                        {msg.sender}
                      </p>
                      <span className="text-sm text-gray-500 ml-2">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    {msg.subject && (
                      <p className={`text-base ${openMessageId === msg._id || !msg.read ? 'font-medium' : ''}`}>
                        {msg.subject}
                      </p>
                    )}
                    {/* Aperçu du contenu si message non ouvert */}
                    {openMessageId !== msg._id && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {msg.content.substring(0, 80)}...
                      </p>
                    )}
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(msg._id)}
                    className={`text-gray-400 hover:text-yellow-500 h-10 w-10 ${msg.favorite ? 'bg-yellow-50' : ''}`}
                    aria-label={msg.favorite ? "Unstar message" : "Star message"}
                  >
                    {msg.favorite ? (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <Star className="w-5 h-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDeleteMessage(msg._id)}
                    className="text-gray-400 hover:text-red-500 h-10 w-10"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {openMessageId === msg._id && (
                <>
                  <Separator />
                  <div className="p-6 bg-blue-50 bg-opacity-50">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {/* Afficher les informations du destinataire */}
                      <div className="mb-4 p-3 bg-blue-100 rounded text-sm">
                        <strong>To:</strong> {msg.receiver}
                      </div>
                      <div className="text-base bg-white p-4 rounded-lg shadow-sm">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal pour la confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-3">Are you sure?</h3>
            <p className="text-gray-600 mb-6 text-base">
              This message will be permanently deleted and cannot be recovered.
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={handleDeleteCancel}
                className="text-base py-2 px-4"
              >
                Cancel
              </Button>
              <Button 
                onClick={deleteMessage} 
                className="bg-red-500 hover:bg-red-600 text-white text-base py-2 px-4"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}