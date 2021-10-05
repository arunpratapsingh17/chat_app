import React from 'react'
import "./Header.css"
import Headercentre from './Headersubparts/Headercentre'
import Headerleft from './Headersubparts/Headerleft'
import Headerright from './Headersubparts/Headerright'
const Header = () => {
    return (
        <div className="Header">
            <Headerleft />
            <Headercentre />
            <Headerright />
        </div>
    )
}

export default Header
