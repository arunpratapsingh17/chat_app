import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Mainbody from './components/Mainbody';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { useEffect } from 'react';
import Auth from '@aws-amplify/auth';
import {getUser} from "./graphql/queries";
import {createUser} from "./graphql/mutations";
import {API,graphqlOperation} from "aws-amplify"
function App() {
  useEffect(()=>{
    const fetchUser = async()=>{
      //Get authenticated user from Auth.
      const userInfo = await Auth.currentAuthenticatedUser({bypassCache:true});
     console.log(userInfo);
      if(userInfo)
      {
        //Get the user from the backend with the user sub from authentication.
        const userData = await API.graphql(graphqlOperation(getUser,{id:userInfo.attributes.sub}));
        if(userData.data.getUser){
          console.log("User is already registered in the database");
          return;
        }
        //If there is no user in the database with that id then create one,
       const newUser = {
         id:userInfo.attributes.sub,
         name:userInfo.username,
         imageUri:"https://cdn-icons-png.flaticon.com/512/147/147144.png",
         status:"Available",
       }
       await API.graphql(
         graphqlOperation(
           createUser,{
             input:newUser
           }
         )
       )
      }
    }
    fetchUser();
  },[])
  return (
    <div className="Home_body">
      <Header />
      <Mainbody />
    </div>
  );
}

export default withAuthenticator(App);
