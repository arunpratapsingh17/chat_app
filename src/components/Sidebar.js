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
import {getChatRoom} from "../graphql/queries"
import { onCreateChatRoom, onCreateChatRoomUser, onUpdateChatRoom, onUpdateChatRoomUser, onUpdateUser } from '../graphql/subscriptions';
const Sidebar = () => {
    const [myUserId,setMyUserId] = useState(null);
    var myId = 0;
    var user1={};
    var user2={};
    const [chatRooms,setChatRooms] = useState([]); 
    var myChatRoom = 0;
    var chatRoom={};
    var array=[];
    useEffect(()=>{
        const fetchUser = async()=>{
            const UserInfo = await Auth.currentAuthenticatedUser();
            console.log("emkker ");
            setMyUserId(UserInfo.attributes.sub);
            myId = UserInfo.attributes.sub;
            console.log(UserInfo.attributes.sub);
        }
        fetchUser();
    },[]);
    useEffect(()=>{
       const fetchChatRooms = async()=>{
        try{
            const userInfo = await Auth.currentAuthenticatedUser();
            const userData = await API.graphql(
                graphqlOperation(
                    getUser,{
                        id:userInfo?.attributes?.sub,
                        sortDirection: "DESC",
                    }
                )
            )
            setChatRooms(userData.data.getUser.chatRoomUser.items);
            // console.log(userData.data.getUser.chatRoomUser.items);
        }catch(e){
            console.log(e);
        }
       }
       fetchChatRooms();
    },[]);
    useEffect(()=>{
        const subscription = API.graphql(
            graphqlOperation(
                onCreateChatRoom
            )
        ).subscribe({
            next:(data)=>{
                console.log("update from backend for new chatroom user");
                console.log(data);
                const newChatRoomID = data.value.data.onCreateChatRoom.id;
                console.log(newChatRoomID);
                const getNewChatRoomData = async()=>{
                    console.log("getNewchatroomdata running");
                    try{
                        var newChatRoom = await API.graphql(
                            graphqlOperation(
                                getChatRoom,{
                                    id:newChatRoomID
                                }
                            )
                        )
                        console.log(newChatRoom);
                    }
                    catch(e){
                        console.log(e);
                    }
                        console.log(newChatRoom?.data?.getChatRoom?.chatRoomUsers?.items[0]?.userID);
                        // console.log(myUserId);
                        var newChatRoom = await API.graphql(
                            graphqlOperation(
                                getChatRoom,{
                                    id:newChatRoomID
                                }
                            )
                        )
                        console.log(newChatRoom);
                        newChatRoom?.data?.getChatRoom?.chatRoomUsers?.items?.map((user)=>{
                            console.log(user.userID,myUserId);
                            if(user.userID==myId){
                                console.log("I am involved in this chatroom");
                                myChatRoom=1;
                                return;
                            }
                        })
                        if(!myChatRoom){
                            console.log("Not my chatroom,returning");
                            return;
                        }
                        else{
                            const getUserData = async()=>{
                                console.log("getUserData running");
                                 user1=await API.graphql(
                                    graphqlOperation(
                                        getUser,{
                                            id:newChatRoom?.data?.getChatRoom?.chatRoomUsers?.items[0].userID
                                        }
                                    )
                                )
                                user2=await API.graphql(
                                    graphqlOperation(
                                        getUser,{
                                            id:newChatRoom?.data?.getChatRoom?.chatRoomUsers?.items[1].userID
                                        }
                                    )
                                )
                                chatRoom={
                                    "chatRoom":{
                                        "chatRoomUsers":{
                                            items:[{
                                                "user":{
                                                    "id":newChatRoom?.data?.getChatRoom?.chatRoomUsers?.items[0].userID,
                                                    "name":user1?.data?.getUser?.name
                                                }
                                            },
                                            {
                                                "user":{
                                                    "id":newChatRoom?.data?.getChatRoom?.chatRoomUsers?.items[0].userID,
                                                    "name":user2?.data?.getUser?.name
                                                }
                                            }
                                            ]
                                        },
                                        "chatRoomID":1
                                    }
                                }
                                setChatRooms((chatRooms)=>[...chatRooms,chatRoom]);
                                myChatRoom=0;
                            }
                            getUserData();
                        }
                //             // console.log(user1,user2);
                //             // console.log(user2?.data?.getUser?.name);
                //             // console.log(newCgetNewChatRoomDatahatRoom?.data?.getChatRoom?.chatRoomUsers?.items[0].userID);
                //         }
                //         // console.log("New chat room flattened data");
                //         // console.log(chatRoom);
                        
                //     }catch(e){
                //         console.log(e);
                //     }
                // if(data.value.data.onCreateChatRoomUser.userID!=myUserId){
                //     console.log("New contact added.");
                //     console.log(data.value.data.onCreateChatRoomUser.userID);
                //     // setChatRooms((chatRooms)=>[...chatRooms,])
                // }
            }
            getNewChatRoomData();
        
        }})
        return ()=>subscription.unsubscribe();
    },[])
    console.log(chatRooms);


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
