import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { Input } from "../../components/common/Input";
import ChatPanel from "./chatPanel";

const Enquiries = () => {
    const [searchValue, setSearchValue] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const enquiriesRef = ref(db, "chic-havens-enquiries");
        const unsubscribe = onValue(enquiriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const updatedChats = Object.entries(data).map(([chatId, chatData]) => ({
                    chatId,
                    user: chatData.user || {},
                    messages: chatData.messages ? Object.values(chatData.messages) : [],
                }));
                setUsers(updatedChats);
                console.log(updatedChats)
            } else {
                setUsers([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e) => setSearchValue(e.target.value);

    const filteredUsers = users.filter((u) =>
        (u.user.name || "Unnamed User").toLowerCase().includes(searchValue.toLowerCase())
    );


    return (
        <div className="d-flex bg-white enquiry" style={{ height: "80vh" }}>
            {/* LEFT SIDEBAR */}
            <div
                className="d-flex flex-column py-1 enquiry-customer-list border-end"
                style={{ width: "350px", flexShrink: 0 }}
            >
                <div className="p-2">
                    <h5>All Chats ({users.length})</h5>
                    <Input
                        name="Search"
                        type="text"
                        placeholder="Enter customer name"
                        label="Search"
                        required={false}
                        value={searchValue}
                        parentDivCss="mt-3"
                        onChange={handleChange}
                    />
                </div>

                <div className="overflow-auto flex-grow-1" style={{ minHeight: 0 }}>
                    {filteredUsers.map((u) => (
                        <div
                            key={u.chatId}
                            className={`d-flex align-items-center gap-2 border-bottom px-2 py-2 rounded-2 w-100 ${selectedUser?.chatId === u.chatId ? "bg-light" : ""
                                }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedUser(u)}
                        >
                            <img
                                src={u.user.photo || "assets/dummy-user-image.jpg"}
                                alt=""
                                width={60}
                                height={60}
                                className="rounded-circle"
                            />
                            <div className="d-flex flex-column">
                                <span className="fw-bold">{u.user.name || "Unnamed User"}</span>
                                <span className="text-muted small">{u.user.email || "No email"}</span>
                                <span className="text-muted small">
                                    {u.messages.length ? `${u.messages.length} message(s)` : "No messages yet"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE - CHAT PANEL */}
            <div className="flex-grow-1 d-flex flex-column">
                {selectedUser ? (
                    <ChatPanel selectedUser={selectedUser} />
                ) : (
                    <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                        Select a customer to start chat
                    </div>
                )}
            </div>
        </div>

    );
};

export default Enquiries;
