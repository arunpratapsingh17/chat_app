import React from 'react'
import MessageAreaHeader from "./MessageAreaSubparts/MessageAreaHeader"
import "./Messagearea.css"
import ChatArea from './MessageAreaSubparts/ChatArea'
import MessageInputArea from './MessageAreaSubparts/MessageInputArea'
const Messagearea = () => {
    return (
        <div className="Messagearea">
            <MessageAreaHeader />
            <ChatArea />
            <MessageInputArea />
        </div>
    )
}

export default Messagearea
