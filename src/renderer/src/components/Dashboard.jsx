import React from 'react'
import Navbar from './Navbar'
import Sections from './Sections'
import Footer from './Footer'

export default function Dashboard() {
    const [dashboardEditor, setDashboardEditor] = React.useState({
        clickableBox: false,
        addElement: 'notepad'
    })

    const [status, setStatus] = React.useState('No recent changes made.')

    function toggleClickableBox() {
        setDashboardEditor((prevDashboardEditor) => ({
            ...prevDashboardEditor,
            clickableBox: !prevDashboardEditor.clickableBox
        }))
    }

    function setStatusBar(newStatus) {
        setStatus(newStatus)
    }

    return (
        <div>
            <Navbar
                clickableBox={dashboardEditor.clickableBox}
                toggleClickableBox={toggleClickableBox}
            />
            <Sections
                element={dashboardEditor.addElement}
                clickableBox={dashboardEditor.clickableBox}
                setStatusBar={setStatusBar}
            />
            <Footer status={status} />
        </div>
    )
}
