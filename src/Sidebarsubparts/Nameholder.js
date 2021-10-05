import React from 'react';
import { Avatar } from '@material-ui/core';
import "./Nameholder.css";
import API from '@aws-amplify/api';
import { graphqlOperation } from '@aws-amplify/api-graphql';
import Auth from '@aws-amplify/auth';
import { createChatRoom,createChatRoomUser } from '../graphql/mutations';
export const Nameholder = ({user}) => {
    const onClick=async ()=>{
        try{
        //1. Create a new chat room.
            var newChatRoomData = await API.graphql(
                graphqlOperation(
                    createChatRoom,{input:{}}
                )
            )
        }catch(e){
            console.log("failed to create new user");
            console.log(e);
        }
        const newChatRoom = newChatRoomData.data.createChatRoom;
        console.log(newChatRoom);
        //2. Add 'user' to that particular chatroom.
            await API.graphql(
                graphqlOperation(
                createChatRoomUser,{
                    input:{
                        userID:user.id,
                        chatRoomID:newChatRoom.id
                    }
                }
            )
            )
        //3. Add the loggedin user to that chatroom.
        const userInfo = await Auth.currentAuthenticatedUser();
        await API.graphql(
            graphqlOperation(
            createChatRoomUser,{
                input:{
                    userID:userInfo.attributes.sub,
                    chatRoomID:newChatRoom.id
                }
                }
            )
        )
    }
    return (
        <div className="Nameholder" onClick={onClick}>
            <Avatar src={user.imageUri} />
            <div className="Username">
                <h3>
                    {user.name}
                </h3>
                <p>
                    kdmwed jnd ejdn 
                </p>
            </div>
        </div>
    )
}
