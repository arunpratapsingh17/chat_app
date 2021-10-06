import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react';
import Auth from '@aws-amplify/auth';
import { Link } from 'react-router-dom';

const ChatListItem = ({chatRoom}) => {
    // console.log("Chat room details");
    // console.log(chatRoom);
    // console.log(chatRoom.chatRoomID);
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
        <Link
        to={`/rooms/${chatRoom.chatRoomID}`}
        className="Nameholder" >
            
                <Avatar src={chatRoom.imageUri} />
                <div className="Username">
                    <h3>
                        {user?(user?.user?.name):null}
                    </h3>
                    <p>
                        kdmwed jnd ejdn 
                    </p>
                </div>
           
        </Link>
        // <div>

        // </div>
    )
}

export default ChatListItem
