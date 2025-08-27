import { Link } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import '../App.css'
import './style/Home.css'
import { useEffect } from 'react';
import a3 from '../assets/logo/a3.png'
import Quick1 from '../assets/logo/a1.png';
import Quick2 from '../assets/logo/a2.png';
import Quick3 from '../assets/logo/a3.png';
import Quick4 from '../assets/logo/a4.png';

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
            <div className="quick-home" data-aos="fade-up" data-aos-duration="4000">
                <img src={Quick3} className="quick-home3" />
                <img src={Quick1} className="quick-home1" />
                <img src={Quick4} className="quick-home4" />
                <img src={Quick2} className="quick-home2" />
            </div>
        </>
    );
};

export default Home;
