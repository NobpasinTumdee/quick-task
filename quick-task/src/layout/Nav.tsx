import { Link, useLocation } from "react-router-dom";
// import home from "../assets/icon/nav/home.svg";
// import taski from "../assets/icon/nav/task.svg";
// import todoi from "../assets/icon/nav/todo.svg";
// import cash from "../assets/icon/nav/cash-outline.svg";
// import mei from "../assets/icon/nav/me.svg";
// import logini from "../assets/icon/nav/login.svg";
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
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" /></svg>
                            </span>
                            <span className="text-nav">Home</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/task') ? 'active' : ''}`}>
                        <Link to="/task">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z" /></svg>
                            </span>
                            <span className="text-nav">Task</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/todo-list') ? 'active' : ''}`}>
                        <Link to="/todo-list">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
                            </span>
                            <span className="text-nav">Todo</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/wallet') ? 'active' : ''}`}>
                        <Link to="/wallet">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z" /></svg>
                            </span>
                            <span className="text-nav">Finance</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/me') ? 'active' : ''}`}>
                        <Link to="/me">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M200-246q54-53 125.5-83.5T480-360q83 0 154.5 30.5T760-246v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm69-80h422q-44-39-99.5-59.5T480-280q-56 0-112.5 20.5T269-200Zm211-320q-25 0-42.5-17.5T420-580q0-25 17.5-42.5T480-640q25 0 42.5 17.5T540-580q0 25-17.5 42.5T480-520Zm0 17Z" /></svg>
                            </span>
                            <span className="text-nav">Me</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/login') ? 'active' : ''}`}>
                        <Link to="/login">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
                            </span>
                            <span className="text-nav">Login</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="nav-container mobile-error">
                <p>ไม่รองรับขนาดจอนี้</p>
                <p>โปรดเปลี่ยนขนาดจอ</p>
            </div>
        </>
    )
}

export default Nav
