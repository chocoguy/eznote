import React from 'react'
import { Link } from 'react-router-dom';

const Taskbar = () => {
    return (
        <div>
            <h1>Ez taskbar handles navigation</h1>
            <ul className="taskbar-main">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/help">Help</Link></li>
                <li><Link to="/notes">Notes</Link></li>
                <li><Link to="/createnote">Create note</Link></li>
                <li><Link to="/editnote">Edit note</Link></li>
            </ul>
        </div>
    )
}

export default Taskbar
