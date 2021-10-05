import React, { useEffect, useState } from 'react'
import "./Headercentre.css";
import Modal from "react-modal"
import { graphqlOperation } from '@aws-amplify/api-graphql';
import API from '@aws-amplify/api';
import { listUsers } from '../../graphql/queries';
import { Nameholder } from '../../Sidebarsubparts/Nameholder';
const Headercentre = () => {
    const [isOpen,setIsopen] = useState(false);
    const [users,setUsers] = useState([]);
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
            <button>Learning</button>
            <button>Teaching</button>
            <button onClick={()=>setIsopen(true)}>Teams</button>
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
        </div>
        
    )
}

export default Headercentre
