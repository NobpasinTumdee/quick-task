import { Link } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import '../App.css'
import './style/Home.css'
import { useEffect } from 'react';
import a3 from '../assets/logo/a3.png'

const Home = () => {
    useEffect(() => { Aos.init({ duration: 1000, once: true, }); }, []);
    return (
        <>
            <div className="hero-container">
                {/* Navigation */}
                <nav className="navigation">
                    <div className="nav-brand" data-aos="fade-down">
                        <div className="nav-logo">
                            <img src={a3} width={30} height={30} alt="" />
                        </div>
                        <span className="nav-title">Quick Task</span>
                    </div>

                    <div className="nav-links">
                        <Link to="/task" className="nav-link" data-aos="fade-down" data-aos-duration="1000">Task Manager</Link>
                        <Link to="/todo-list" className="nav-link" data-aos="fade-down" data-aos-duration="1200">Todo list</Link>
                        <Link to="/me" className="nav-link" data-aos="fade-down" data-aos-duration="1400">About</Link>
                        <Link to="/login" className="nav-button" data-aos="fade-down" data-aos-duration="1600">Sign In</Link>
                    </div>
                </nav>
                <div className='hero-content'>
                    <h1 data-aos="zoom-in-up" data-aos-duration="1500">Organize Your Life<br />Effortlessly</h1>
                    <h3 data-aos="zoom-in-up" data-aos-duration="2500">Master your daily routine with our all-in-one productivity platform. Manage tasks, track finances, and achieve your goals with intelligent automation.</h3>
                </div>
            </div>
        </>
    );
};

export default Home;
