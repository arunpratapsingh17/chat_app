import React from 'react'
import "./Headerright.css";
 import { BsChat } from "react-icons/bs";
 import { AiOutlineBell } from "react-icons/ai";
import { Avatar } from '@material-ui/core';
// import { FaBeer } from 'react-icons/fa';
import { FaPencilAlt } from "react-icons/fa"
const Headerright = () => {
    return (
        <div className="Headerright">
            {/* <FaBeer /> */}
            {/* <FaPencilAlt /> */}
            <AiOutlineBell className="Icon" />
            <BsChat className="Icon"  />
            <Avatar alt="Random DP" src="" />
        </div>
    )
}

export default Headerright
