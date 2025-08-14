import { Link, useLocation } from "react-router-dom";
import home from "../assets/icon/nav/home.svg";
import taski from "../assets/icon/nav/task.svg";
import todoi from "../assets/icon/nav/todo.svg";
import cash from "../assets/icon/nav/cash-outline.svg";
import mei from "../assets/icon/nav/me.svg";
import logini from "../assets/icon/nav/login.svg";
import "./Nav.css";

const Nav = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    return (
        <>
            <div className="nav-container">
                <ul>
                    <li className={`list-nav ${isActive('/') ? 'active' : ''}`}>
                        <Link to="/">
                            <span className="icon-nav">
                                <img src={home} width={30} />
                            </span>
                            <span className="text-nav">Home</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/task') ? 'active' : ''}`}>
                        <Link to="/task">
                            <span className="icon-nav">
                                <img src={taski} width={30} />
                            </span>
                            <span className="text-nav">Task</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/todo-list') ? 'active' : ''}`}>
                        <Link to="/todo-list">
                            <span className="icon-nav">
                                <img src={todoi} width={30} />
                            </span>
                            <span className="text-nav">Todo</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/finance') ? 'active' : ''}`}>
                        <Link to="/finance">
                            <span className="icon-nav">
                                <img src={cash} width={30} />
                            </span>
                            <span className="text-nav">Finance</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/me') ? 'active' : ''}`}>
                        <Link to="/me">
                            <span className="icon-nav">
                                <img src={mei} width={30} />
                            </span>
                            <span className="text-nav">Me</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/login') ? 'active' : ''}`}>
                        <Link to="/login">
                            <span className="icon-nav">
                                <img src={logini} width={30} />
                            </span>
                            <span className="text-nav">Login</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Nav
