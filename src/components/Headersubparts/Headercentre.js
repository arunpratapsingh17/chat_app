import React, { useEffect, useState } from 'react'
import "./Headercentre.css";
import Modal from "react-modal"
import { graphqlOperation } from '@aws-amplify/api-graphql';
import API from '@aws-amplify/api';
import { listUsers } from '../../graphql/queries';
import { Nameholder } from '../../Sidebarsubparts/Nameholder';
import { Auth } from 'aws-amplify';
import { Avatar } from '@material-ui/core';
import { createChatRoom, createChatRoomUser } from '../../graphql/mutations';
const Headercentre = () => {
    const [isOpen,setIsopen] = useState(false);
    const [isOpen1,setIsopen1] = useState(false);
    const [users,setUsers] = useState([]);
    const [show,setShow] = useState(false)
    const [value,setValue] = useState("");
    const [groupMembers,setGroupMembers] = useState([]);
    const [newChatRoom,setNewChatRoom] = useState([]);
    const addGroupMember=async(user)=>{
        // console.log(user);
        try{
            await API.graphql(
                graphqlOperation(
                createChatRoomUser,{
                    input:{
                        userID:user.id,
                        chatRoomID:newChatRoom?.id
                    }
                }
            )
            )
            setGroupMembers(groupMembers=>[...groupMembers,user])
        }catch(e){
            console.log("Failed to add new member to the chat");
            console.log(e);
        }
    }
    const handleGroupNameSubmit=async (e)=>{
        e.preventDefault();
        // console.log(e.target.GroupName.value);
        setShow(true);
        // setGroupMembers([{name:"Arun"}]);
        try{
            //1. Create a new chat room.
                var newChatRoomData = await API.graphql(
                    graphqlOperation(
                        createChatRoom,{input:{
                            group:1,
                            groupName:e.target.GroupName.value,
                        }}
                    )
                )
                setNewChatRoom(newChatRoomData.data.createChatRoom);
                // console.log("New chat room data");
                // console.log(newChatRoomData.data.createChatRoom);
            }catch(e){
                console.log("failed to create new chat room");
                console.log(e);
            }
            try{
                const userInfo = await Auth.currentAuthenticatedUser();
                await API.graphql(
                    graphqlOperation(
                    createChatRoomUser,{
                        input:{
                            userID:userInfo.attributes.sub,
                            chatRoomID:newChatRoomData.data.createChatRoom.id
                        }
                        }
                    )
                )
            }catch(e){
                console.log("Failed to add new member in the chat");
                console.log(e);
            }
    }
    useEffect(()=>{
        const fetchUsers = async ()=>{
            try{
                const userData = await API.graphql(
                    graphqlOperation(
                        listUsers
                    )
                );
                setUsers(userData.data.listUsers.items)
            }catch(e){
                console.log(e);
            }
        }
        fetchUsers();
    },[])
    return (
        <div className="Headercentre">
            <button onClick={()=>{
                setIsopen1(true)}}>Create Group</button>
            <button onClick={async()=>{
                await Auth.signOut()
            }}>Signout</button>
            <button onClick={()=>setIsopen(true)}>Contacts</button>
            <Modal isOpen={isOpen} shouldCloseOnEsc={true} shouldCloseOnOverlayClick={true} ariaHideApp={false} onRequestClose={()=>setIsopen(false)} style={
            {
                overlay:{
                    backgroundColor:'#9898ac',
                },
                content : {
                    top                   : '50%',
                    left                  : '50%',
                    right                 : 'auto',
                    bottom                : 'auto',
                    marginRight           : '-50%',
                    transform             : 'translate(-50%, -50%)',
                    height:'400px',
                    width:'300px',
                    borderRadius:"20px",
                  }
            }
        }>
            <h1>Contacts</h1>
            {users.map((user)=>{
                return <Nameholder user={user}/>
            })}
        </Modal>
        <Modal isOpen={isOpen1} shouldCloseOnEsc={true} shouldCloseOnOverlayClick={true} ariaHideApp={false} onRequestClose={()=>setIsopen1(false)} style={
            {
                overlay:{
                    backgroundColor:'#9898ac',
                },
                content : {
                    top                   : '50%',
                    left                  : '50%',
                    right                 : 'auto',
                    bottom                : 'auto',
                    marginRight           : '-50%',
                    transform             : 'translate(-50%, -50%)',
                    height:'400px',
                    width:'300px',
                    borderRadius:"20px",
                  }
            }
        }>
            <h1>Create your group</h1>
            {show?(groupMembers.map((item)=>{
                return <li>{item.name}</li>
            }))
            :
            (<form onSubmit={(e)=>handleGroupNameSubmit(e)}>
                <p>Enter the name of the group</p>
                <input value={value} name="GroupName" onChange={(e)=>setValue(e.target.value)} />
            </form>)}
            <h3>Add members</h3>
            {users.map((user)=>{
                return( 
                <div className="Nameholder" onClick={()=>addGroupMember(user)} >
                 <Avatar src={user.imageUri} />
                 <div className="Username">
                     <h3>
                         {user.name}
                     </h3>
                     <p>{user.id}</p>
                 </div>
             </div>
            )})}
        </Modal>
        </div>
        
    )
}

export default Headercentre
