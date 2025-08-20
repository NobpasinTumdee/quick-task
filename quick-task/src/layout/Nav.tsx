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
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M192-144v-456l288-216 288 216v456H552v-264H408v264H192Z" /></svg>
                            </span>
                            <span className="text-nav">Home</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/task') ? 'active' : ''}`}>
                        <Link to="/task">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm80-160h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790Z" /></svg>
                            </span>
                            <span className="text-nav">Task</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/todo-list') ? 'active' : ''}`}>
                        <Link to="/todo-list">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z" /></svg>
                            </span>
                            <span className="text-nav">Todo</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/wallet') ? 'active' : ''}`}>
                        <Link to="/wallet">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Z" /></svg>
                            </span>
                            <span className="text-nav">Finance</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/me') ? 'active' : ''}`}>
                        <Link to="/me">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M480-440q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-46q-54-53-125.5-83.5T480-360q-83 0-154.5 30.5T200-246v46Z" /></svg>
                            </span>
                            <span className="text-nav">Me</span>
                            <span className="circle"></span>
                        </Link>
                    </li>
                    <li className={`list-nav ${isActive('/login') ? 'active' : ''}`}>
                        <Link to="/login">
                            <span className="icon-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--text-main)"><path d="M481-781q106 0 200 45.5T838-604q7 9 4.5 16t-8.5 12q-6 5-14 4.5t-14-8.5q-55-78-141.5-119.5T481-741q-97 0-182 41.5T158-580q-6 9-14 10t-14-4q-7-5-8.5-12.5T126-602q62-85 155.5-132T481-781Zm0 94q135 0 232 90t97 223q0 50-35.5 83.5T688-257q-51 0-87.5-33.5T564-374q0-33-24.5-55.5T481-452q-34 0-58.5 22.5T398-374q0 97 57.5 162T604-121q9 3 12 10t1 15q-2 7-8 12t-15 3q-104-26-170-103.5T358-374q0-50 36-84t87-34q51 0 87 34t36 84q0 33 25 55.5t59 22.5q34 0 58-22.5t24-55.5q0-116-85-195t-203-79q-118 0-203 79t-85 194q0 24 4.5 60t21.5 84q3 9-.5 16T208-205q-8 3-15.5-.5T182-217q-15-39-21.5-77.5T154-374q0-133 96.5-223T481-687Zm0-192q64 0 125 15.5T724-819q9 5 10.5 12t-1.5 14q-3 7-10 11t-17-1q-53-27-109.5-41.5T481-839q-58 0-114 13.5T260-783q-8 5-16 2.5T232-791q-4-8-2-14.5t10-11.5q56-30 117-46t124-16Zm0 289q93 0 160 62.5T708-374q0 9-5.5 14.5T688-354q-8 0-14-5.5t-6-14.5q0-75-55.5-125.5T481-550q-76 0-130.5 50.5T296-374q0 81 28 137.5T406-123q6 6 6 14t-6 14q-6 6-14 6t-14-6q-59-62-90.5-126.5T256-374q0-91 66-153.5T481-590Zm-1 196q9 0 14.5 6t5.5 14q0 75 54 123t126 48q6 0 17-1t23-3q9-2 15.5 2.5T744-191q2 8-3 14t-13 8q-18 5-31.5 5.5t-16.5.5q-89 0-154.5-60T460-374q0-8 5.5-14t14.5-6Z" /></svg>
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
