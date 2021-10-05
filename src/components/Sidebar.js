import React, { useEffect, useState } from 'react'
import { listUsers } from '../graphql/queries'
import { Nameholder } from '../Sidebarsubparts/Nameholder'
import Search from '../Sidebarsubparts/Search';
import {API,graphqlOperation} from "aws-amplify"
import "./Sidebar.css"
const Sidebar = () => {
    const [users,setUsers] = useState([])
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
        <div className="Sidebar">
            <Search />
            <div className="MessagesList">
                    {/* {console.log(users)} */}
                    {users.map((user,index)=>{
                        console.log(user);
                        return <Nameholder user={user} />
                    })}
            </div>
        </div>
    )
}

export default Sidebar
