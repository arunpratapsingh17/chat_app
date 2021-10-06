import React from 'react'
import "./ChatArea.css"
const ChatArea = () => {
    return (
        <div className="ChatArea">
            {/* <div className="chat_body">
                {messages.map((message) => (
                 <p
                     className={`chat_message ${
                     message.name === user.displayName && "chat_reciever"
                }`}
                >
                <span className="chat_name">{message.name}</span>
                {message.message}
                <span className="chat_timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
                </span>
            </p>
            ))}
        </div> */}
    </div>
    )
}

export default ChatArea
