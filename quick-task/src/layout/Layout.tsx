import Navbar from './Nav'
import { Outlet } from 'react-router-dom'

const Rootlayout = () => {
    return (
        <>
            <Outlet />
            <Navbar />
        </>
    )
}

export default Rootlayout
