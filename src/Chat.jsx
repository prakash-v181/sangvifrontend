import React, { useState } from 'react';

const Chat = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input) return;

        // 1. Add user message to UI immediately
        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);


        try {
            // 2. Send to YOUR backend (not OpenAI directly)
            const response = await fetch("http://localhost:8880/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            // 3. Add AI response to UI
            const botMessage = { sender: "gemini", text: data.reply };
            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [...prev, { sender: "system", text: "Error connecting to server" }]);
        }

        setLoading(false);
        setInput("");
    };
    

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial" }}>
            <h2>SangviGPT new Chat</h2>
            
            {/* Chat Box Area */}
            <div style={{ 
                border: "1px solid #ccc", 
                height: "400px", 
                overflowY: "scroll", 
                padding: "20px", 
                marginBottom: "20px",
                borderRadius: "10px"
            }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ 
                        textAlign: msg.sender === "user" ? "right" : "left", 
                        margin: "10px 0" 
                    }}>
                        <span style={{ 
                            background: msg.sender === "user" ? "#007bff" : "#e9ecef", 
                            color: msg.sender === "user" ? "white" : "black",
                            padding: "10px 15px", 
                            borderRadius: "15px",
                            display: "inline-block",
                            maxWidth: "70%"
                        }}>
                            {msg.text}
                        </span>
                    </div>
                ))}
                {loading && <p>Thinking...</p>}
            </div>




            

            {/* Input Area */}
            <div style={{ display: "flex", gap: "10px" }}>
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something..."
                    style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                    onClick={sendMessage} 
                    style={{ 
                        padding: "10px 20px", 
                        background: "#28a745", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer" 
                    }}
                >
                    Send
                </button>
            </div>


            
        </div>
    );
};

export default Chat;