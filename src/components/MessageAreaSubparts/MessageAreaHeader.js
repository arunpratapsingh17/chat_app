import React from 'react';
import {AiOutlineMenu} from "react-icons/ai"
import "./MessageAreaHeader.css"
const Header = () => {
    return (
        <div className="MessageAreaHeader">
            <div>
                <h4>
                    Jessie Pinkman
                </h4>
                <p>
                    Local Time
                </p>
            </div>
            <div className="MenuPartHeader">
                <AiOutlineMenu />
            </div>
        </div>
    )
}

export default Header
