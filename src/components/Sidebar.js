import React from 'react'
import { Nameholder } from '../Sidebarsubparts/Nameholder'
import Search from '../Sidebarsubparts/Search'
import "./Sidebar.css"
const Sidebar = () => {
    return (
        <div className="Sidebar">
            <Search />
            <div className="MessagesList">
                    <Nameholder />
                    <Nameholder />
                    <Nameholder />
            </div>
        </div>
    )
}

export default Sidebar
