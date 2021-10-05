import React from 'react';
import { Avatar } from '@material-ui/core';
import "./Nameholder.css"
export const Nameholder = ({user}) => {
    console.log("reached");
    return (
        <div className="Nameholder">
            <Avatar src={user.imageUri} />
            <div className="Username">
                <h3>
                    {user.name}
                </h3>
                <p>
                    kdmwed jnd ejdn 
                </p>
            </div>
        </div>
    )
}
