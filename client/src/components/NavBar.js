import { NavLink } from "react-router-dom"
import logo from "../logo.png";
import '../styles/NavBar.css'

function NavBar() {
    
    return (
        <div className="navbar">
            <img className="logo" src={logo} alt="logo" />
            <nav className="navigation">
                <NavLink className="nav-item" to="/closet">Closet</NavLink>
                <NavLink className="nav-item" to="/calendar">Calendar</NavLink>
                <NavLink className="nav-item" to="/outfit">Today's Outfit</NavLink>
            </nav>
        </div>
    );
}

export default NavBar;