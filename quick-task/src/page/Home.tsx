import { Link } from 'react-router-dom';
import '../App.css'
import './style/Home.css'

const Home = () => {
    return (
        <>
            <div className="hero-container">
                {/* Navigation */}
                <nav className="navigation">
                    <div className="nav-brand">
                        <div className="nav-logo">
                            ✨
                        </div>
                        <span className="nav-title">Quick Task</span>
                    </div>

                    <div className="nav-links">
                        <Link to="/task" className="nav-link">Task Manager</Link>
                        <Link to="/todo-list" className="nav-link">Todo list</Link>
                        <Link to="/me" className="nav-link">About</Link>
                        <Link to="/login" className="nav-button">Sign In</Link>
                    </div>

                </nav>
                <div className='hero-content'>
                    <h1>Organize Your Life<br />Effortlessly</h1>
                    <h3>Master your daily routine with our all-in-one productivity platform. Manage tasks, track finances, and achieve your goals with intelligent automation.</h3>
                </div>
            </div>
        </>
    );
};

export default Home;
