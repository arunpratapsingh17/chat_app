import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react';
import Auth from '@aws-amplify/auth';

const ChatListItem = ({chatRoom}) => {
    const [user,setUser] = useState({});
    useEffect(()=>{
        const userCheck=async ()=>{
            const userInfo = await Auth.currentAuthenticatedUser({bypassCache:true});
            if(chatRoom.chatRoom.chatRoomUsers.items[0].user.name===userInfo.username){
                setUser(chatRoom.chatRoom.chatRoomUsers.items[1]);
            }
            else{
                setUser(chatRoom.chatRoom.chatRoomUsers.items[0]);
            }
        }
        userCheck();
    },[])
    // console.log(user.user.name);
    return (
        <div className="Nameholder" >
            <Avatar src={chatRoom.imageUri} />
            <div className="Username">
                <h3>
                    {user?(user?.user?.name):null}
                </h3>
                <p>
                    kdmwed jnd ejdn 
                </p>
            </div>
        </div>
        // <div>

        // </div>
    )
}

export default ChatListItem
