import React from 'react'
import "./Mainchatpart.css"
import Messagearea from './Messagearea'
import Sidebar from './Sidebar'
const Mainchatpart = () => {
    return (
        <div className="Mainchatpart">
            <Sidebar />
            <Messagearea />
        </div>
    )
}

export default Mainchatpart
