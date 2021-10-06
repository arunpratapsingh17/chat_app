import React from 'react'
import "./Mainchatpart.css"
import Messagearea from './Messagearea';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sidebar from './Sidebar'
const Mainchatpart = () => {
    return (
        <div className="Mainchatpart">
            <Router>
                <Sidebar />
                <Route path="/rooms/:chatRoomId">
                     <Messagearea />
                </Route>
            </Router>
        </div>
    )
}

export default Mainchatpart
