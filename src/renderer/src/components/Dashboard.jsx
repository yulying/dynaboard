import React from 'react'
import Navbar from './Navbar'
import Sections from './Sections'
import Footer from './Footer'

export default function Dashboard() {
    const [dashboardEditor, setDashboardEditor] = React.useState( {
        clickableBox: false,
        addElement: "notepad"
    })

    function toggleClickableBox() {
        setDashboardEditor(prevDashboardEditor => ({
            ...prevDashboardEditor,
            clickableBox: !prevDashboardEditor.clickableBox
        }))
    }

    return (
        <div>
            <Navbar clickableBox={ dashboardEditor.clickableBox } toggleClickableBox={ toggleClickableBox }/>
            <Sections element={ dashboardEditor.addElement } clickableBox={ dashboardEditor.clickableBox }/>
            <Footer />
        </div>
        
    )
}