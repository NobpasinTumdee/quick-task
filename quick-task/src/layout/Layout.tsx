import { checkTheme } from '../component/Theme';
import Navbar from './Nav'
import { Outlet } from 'react-router-dom'

const Rootlayout = () => {
    checkTheme();
    return (
        <>
            <Outlet />
            <Navbar />
        </>
    )
}

export default Rootlayout
