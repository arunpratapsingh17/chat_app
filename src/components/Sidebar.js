import React, { useEffect, useState } from 'react'
import { listUsers, messagesByChatRoom } from '../graphql/queries'
import { Nameholder } from '../Sidebarsubparts/Nameholder';
import Search from '../Sidebarsubparts/Search';
import {API,graphqlOperation} from "aws-amplify";
import Auth from '@aws-amplify/auth';
import { getUser } from './query.js';
import "./Sidebar.css"
import { createChatRoom } from '../graphql/mutations';
import ChatListItem from './ChatListItem';
import { onCreateChatRoomUser } from '../graphql/subscriptions';
const Sidebar = () => {
    const [myUserId,setMyUserId] = useState(null);
    const [chatRooms,setChatRooms] = useState([]); 
    const [messages,setMessages] = useState([])
    useEffect(()=>{
        const fetchUser = async()=>{
            const UserInfo = await Auth.currentAuthenticatedUser();
            setMyUserId(UserInfo.attributes.sub);
        }
        fetchUser();
    },[]) 
    useEffect(()=>{
       const fetchChatRooms = async()=>{
        try{
            const userInfo = await Auth.currentAuthenticatedUser();
            const userData = await API.graphql(
                graphqlOperation(
                    getUser,{
                        id:userInfo.attributes.sub,
                        sortDirection: "DESC",
                    }
                )
            )
            setChatRooms(userData.data.getUser.chatRoomUser.items);
        }catch(e){
            console.log(e);
        }
       }
       fetchChatRooms();
    },[]);
    
    useEffect(()=>{
        const subscription = API.graphql(
            graphqlOperation(
                onCreateChatRoomUser
            )
        ).subscribe({
            next:(data)=>{
                console.log("update from backend for new chatroom");
                console.log(data);
                if(data.value.data.onCreateChatRoomUser.userID!=myUserId){
                    console.log("New contact added.");
                    console.log(data.value.data.onCreateChatRoomUser.userID);
                }
            }
        })
    },[])



    // const fetchMessages = async () => {
    //     const messagesData = await API.graphql(
    //     graphqlOperation(
    //         messagesByChatRoom, {
    //         chatRoomID: "152010c4-ecb2-46f6-b20e-a62af27d7464",
    //         sortDirection: "DESC",
    //         }
    //     )
    //     )
    //     console.log("FETCH MESSAGES")
    //     setMessages(messagesData.data.messagesByChatRoom.items);
    //     console.log("Here");
    //     console.log(messages);
    // }

    //  useEffect(() => {
    //     fetchMessages();
    // }, [])




    //  console.log(chatRooms);
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
