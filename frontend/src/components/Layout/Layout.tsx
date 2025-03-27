import Sidebar from '../Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <div className='w-full flex space-x-2'>
                <div className='w-96'>
                    <Sidebar />
                </div>
                <div className='w-full overflow-auto h-[952px] '>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout