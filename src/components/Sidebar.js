import React, { useEffect, useState } from 'react'
import { listUsers } from '../graphql/queries'
import { Nameholder } from '../Sidebarsubparts/Nameholder'
import Search from '../Sidebarsubparts/Search';
import {API,graphqlOperation} from "aws-amplify";
import Auth from '@aws-amplify/auth';
import { getUser } from './query.js';
import "./Sidebar.css"
import { createChatRoom } from '../graphql/mutations';
import ChatListItem from './ChatListItem';
const Sidebar = () => {
    const [chatRooms,setChatRooms] = useState([]);  
    useEffect(()=>{
       const fetchChatRooms = async()=>{
        try{
            const userInfo = await Auth.currentAuthenticatedUser();
            const userData = await API.graphql(
                graphqlOperation(
                    getUser,{
                        id:userInfo.attributes.sub
                    }
                )
            )
            console.log(userData.data.getUser.chatRoomUser.items);
            setChatRooms(userData.data.getUser.chatRoomUser.items)
            console.log(chatRooms);
        }catch(e){
            console.log(e);
        }
       }
       fetchChatRooms();
    },[])
    return (
        <div className="Sidebar">
            <Search />
            <div className="MessagesList">
                    {chatRooms.map((chatRoom)=>{
                        return <ChatListItem chatRoom={chatRoom} />
                    })}
            </div>
        </div>
    )
}

export default Sidebar
