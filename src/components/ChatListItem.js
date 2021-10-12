import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react';
import Auth from '@aws-amplify/auth';
import { Link } from 'react-router-dom';
import {BiGroup} from "react-icons/bi"

const ChatListItem = ({chatRoom}) => {
    // console.log("Chat room details");
    // console.log(chatRoom);
    // console.log(chatRoom.chatRoomID);
    const [user,setUser] = useState({});
    const [group,setGroup] = useState(false)
    useEffect(()=>{
        // console.log(chatRoom);
        const userCheck=async ()=>{
            const userInfo = await Auth.currentAuthenticatedUser({bypassCache:true});
            if(chatRoom.chatRoom.chatRoomUsers.items[0].user.name===userInfo.username){
                setUser(chatRoom.chatRoom.chatRoomUsers.items[1]);
            }
            else{
                setUser(chatRoom.chatRoom.chatRoomUsers.items[0]);
            }
        }
        if(!chatRoom.chatRoom.group){
            userCheck();
        }
        else{
            setGroup(true);
        }
    },[])
    // console.log(user.user.name);
    return (
        <Link
        to={`/rooms/${chatRoom.chatRoomID}`}
        className="Nameholder" >
            
                <Avatar src={chatRoom.imageUri} />
                <div className="Username">
                    <h3>
                        {/* {user?(user?.user?.name):null} */}
                        {group?(chatRoom?.chatRoom?.groupName):(user?.user?.name)}
                    </h3>
                </div>
           
        </Link>
        // <div>

        // </div>
    )
}

export default ChatListItem
