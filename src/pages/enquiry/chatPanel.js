import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import { ref, push, onChildAdded } from "firebase/database";

const ChatPanel = ({ selectedUser }) => {
    const { chatId, user } = selectedUser || {};
    const [messages, setMessages] = useState(selectedUser?.messages || []);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!chatId) return;

        setMessages([]); // start fresh

        const messagesRef = ref(db, `chic-havens-enquiries/${chatId}/messages`);

        const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
            const msg = snapshot.val();
            setMessages((prev) => [...prev, msg]);
        });

        return () => unsubscribe();
    }, [chatId]);


    // 🔹 Scroll to bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // 🔹 Send message as admin
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !chatId) return;

        const messagesRef = ref(db, `chic-havens-enquiries/${chatId}/messages`);
        await push(messagesRef, {
            text: newMessage,
            sender: "admin",
            timestamp: Date.now(),
        });

        setNewMessage("");
    };

    if (!selectedUser) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                Select a user to start chat
            </div>
        );
    }

    return (
        <div className="chat-panel d-flex flex-column h-100 border">
            {/* Header */}
            <div className="chat-header p-2 border-bottom bg-light">
                <strong>{user?.name || "Unnamed User"}</strong>
                <span className="d-block text-muted small">{user?.email || "No email"}</span>
                <span className="d-block text-muted small">{user?.phone || "No phone"}</span>
            </div>

            {/* Messages */}
            <div className="chat-messages flex-grow-1 overflow-auto p-2">
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`d-flex flex-column mb-2 ${msg.sender === "admin" ? "align-items-end" : "align-items-start"
                                }`}
                        >
                            <div
                                className={`p-2 rounded ${msg.sender === "admin" ? "bg-primary text-white" : "bg-light text-dark"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <small className="text-muted">
                                {msg.timestamp
                                    ? new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </small>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted mt-3">No messages yet</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input border-top p-2 d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;
