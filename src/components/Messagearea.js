import React, { useEffect, useState } from 'react'
import MessageAreaHeader from "./MessageAreaSubparts/MessageAreaHeader"
import "./Messagearea.css"
import ChatArea from './MessageAreaSubparts/ChatArea'
import MessageInputArea from './MessageAreaSubparts/MessageInputArea';
import awsExports from "../aws-exports";
import {API,Auth,graphqlOperation,Storage} from "aws-amplify";
import {createMessage, createPicture} from "../graphql/mutations";
import { useParams } from "react-router-dom";
import {  getUser } from '../graphql/queries';
import { getChatRoom } from '../graphql/queries';
import {AiOutlineMenu} from "react-icons/ai";
import {onCreateMessage} from "../graphql/subscriptions";
import googleURL from "google-url";
import { ReactTinyLink } from 'react-tiny-link';
import {FaLink} from "react-icons/fa";

const Messagearea = () => {
    const {chatRoomId}= useParams();
    const [chatRoomData,setChatRoomData] = useState({});
    const [otherPersonDetails,setOtherPersonDetails] = useState({});
    const [file,setFile] = useState(null);
    // console.log(useParams());
    // console.log(chatRoomId);
    const [message,setMessage] = useState([]);
    const [myUserId,setMyUserId] = useState(null);
    const [value,setValue] = useState("");
    const [group,setGroup] = useState(false);
    const [groupMembers,setGroupMembers] = useState([]);
    const [fileLink,setFileLink] = useState("");
    const [myUsername,setMyUsername] = useState("")
    var array=[];
    



    const handleSubmit=async (e)=>{
        e.preventDefault();
        if(value=="")
            return
        try{
            await API.graphql(
                graphqlOperation(
                    createMessage,{
                        input:{
                            content:value,
                            userID:myUserId,
                            chatRoomID:chatRoomId,
                            senderName:myUsername
                        }
                    }
                )
            )
        }catch(e){
            console.log(e);
        }
        setValue("")
    }


    const addImageToDB=async(image)=>{
        // console.log("Adding image to database");
        // console.log(image);
        try{
           const fileData =  await API.graphql(
                graphqlOperation(
                    createPicture,{input:image}
                )
            )
            // console.log(fileData);
            try{
                const resultFromStorage = await Storage.get(image.file.key);
                // console.log("This is what we are getting from the store");
                // console.log(resultFromStorage);
                setFileLink(resultFromStorage)
            }catch(e){
                console.log(e);
            }
        }
        catch(e){
            console.log(e);
        }
        // addNewMessageAfterS3Operations()
    }

    const handleFileChange=(e)=>{
        const file = e.target.files[0];
        // console.log(file);
        Storage.put(file.name,file,{
            contentType:'file'
        }).then((result)=>{
            setFile({file:URL.createObjectURL(file)});
            // console.log(result);
            const image = {
                name:file.name,
                file:{
                    bucket:awsExports.aws_user_files_s3_bucket,
                    region:awsExports.aws_user_files_s3_bucket_region,
                    key:result.key
                }
            }
            // console.log(image);
            addImageToDB(image);
            setFile(null);
        })
    }

    useEffect(()=>{
        setGroup(false);
        setGroupMembers([]);
        setOtherPersonDetails({});
        setChatRoomData({});
        setMessage([])
        const fetchChatRooms=async()=>{
            try{
                const chatRoomDetails=await API.graphql(
                    graphqlOperation(
                        getChatRoom,{
                            id:chatRoomId
                        }
                    )
                )
                // console.log("Chat room details from chat");
                // console.log(chatRoomDetails);
                setChatRoomData(chatRoomDetails.data.getChatRoom);
            }catch(e){
                console.log(e);
            }
        }
        fetchChatRooms();
    },[chatRoomId])

    useEffect(()=>{
        const fetchUser = async()=>{
            const UserInfo = await Auth.currentAuthenticatedUser();
            // console.log(UserInfo);
            setMyUsername(UserInfo.username)
            setMyUserId(UserInfo.attributes.sub);
        }
        fetchUser();
    },[])
    useEffect(()=>{
        if(chatRoomData!={}){
            chatRoomData?.chatRoomUsers?.items.map((data)=>{
                // console.log("Chap");
                // console.log(data.userID);
                // console.log("My user id");
                // console.log(myUserId);
                if(data.userID!=myUserId){
                    const getOtherUserData=async()=>{
                        const otherUserData = await API.graphql(
                            graphqlOperation(
                                getUser,{
                                    id:data.userID
                                }
                            )
                        )
                        setOtherPersonDetails(otherUserData.data.getUser);
                    }
                    getOtherUserData();
                    // console.log("Chat room data");
                    // console.log(chatRoomData);
                    setMessage(chatRoomData.messages.items)
                }
            })
            if(chatRoomData.group){
                setGroup(true);
                chatRoomData?.chatRoomUsers?.items.map(async(groupMember)=>{
                         const otherUserData = await API.graphql(
                            graphqlOperation(
                                getUser,{
                                    id:groupMember.userID
                                }
                            )
                        )
                        array.push(otherUserData.data.getUser)
                })
            }
            setGroupMembers(array)
        }
    },[chatRoomData]);
    useEffect(()=>{
        const subscription = API.graphql(
            graphqlOperation(
                onCreateMessage,
            )
        ).subscribe({
            next:(data)=>{
                // console.log("update from backend");
                // console.log(data.value.data.onCreateMessage);
                setMessage(message=>[...message,data.value.data.onCreateMessage])
            }
        })
        return ()=>subscription.unsubscribe();
    },[])

    //To take action after fetching the link from S3 storage.
    useEffect(()=>{
        if(fileLink===""){
            return
        }
       const handleMessageCreationAfterStorageFetch = async()=>{
        try{
            // console.log(fileLink);
            await API.graphql(
                graphqlOperation(
                    createMessage,{
                        input:{
                            content:fileLink,
                            userID:myUserId,
                            chatRoomID:chatRoomId,
                            awsLink:true,
                            senderName:myUsername
                        }
                    }
                )
            )
        }catch(e){
            console.log(e);
        }
       }
       handleMessageCreationAfterStorageFetch()
    },[fileLink])

    // console.log("9 34");
    // // console.log(otherPersonDetails);
    // console.log(chatRoomData);

    // console.log("12 57");
    // console.log(groupMembers);
    // console.log(message);
    return (
        <div className="Messagearea">
            <div className="MessageAreaHeader">
                <div>
                {/* <h4> */}
                  {/* {otherPersonDetails.name} */}
                  
                 {/* </h4> */}
                 {group?(groupMembers.map((groupMember)=>{
                     return <span style={{fontWeight:"bold"}}>{groupMember.name} </span>
                 })):(<h4>{otherPersonDetails.name}</h4>)}
                </div>
                <div className="MenuPartHeader">
                    <AiOutlineMenu />
                </div>
            </div>
            <div className="ChatArea">
                    <div className="chat_body">
                        {message?.map((message) => 
                        {
                            // console.log(message);
                        if(message?.awsLink){
                            return <div
                            className={`chat_message ${
                                message.userID === myUserId && "chat_reciever"
                            }`}
                            >
                                <ReactTinyLink
                            cardSize="small"
                            showGraphic={false}
                            maxLine={1}
                            minLine={1}
                            width="200px"
                            url={message.content}
                            />
                            </div>
                        }
                        return <div className="MessageDatas">
                            <p
                            className={`chat_message ${
                            message.userID === myUserId && "chat_reciever"
                            }`}
                             >
                                <span className="chat_name">{message?.senderName}</span>
                                {message.content}
                            {/* <span className="chat_timestamp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                            </span> */}
                            </p>
                        </div>
                        })}
                    </div>
                {/* <div>
                    {chatRoomData.messages.items.map((message)=>{
                        return <p>{message.content}</p>
                    })}
                </div> */}
            </div>
            <div className="MessageInputArea">
                <form className="Form" onSubmit={(e)=>handleSubmit(e)}>
                    <input className="TextInput" value={value} onChange={(e)=>setValue(e.target.value)}/>
                    <input className="FileSubmit" type="file" onChange={(e)=>handleFileChange(e)} />
                    <button className="textSubmit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Messagearea
