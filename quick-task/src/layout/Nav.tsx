import { Link } from "react-router-dom"

const Nav = () => {
    return (
        <>
            <h1>Navbar</h1>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/todo-list">Todo</Link></li>
                <li><Link to="/task">Task</Link></li>
                <li><Link to="/finance">Finance</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </>
    )
}

export default Nav
