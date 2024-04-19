import React from 'react'
import Navbar from './Navbar'
import Sections from './Sections'

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
            <div id='navbar-empty-space' />
            <Navbar clickableBox={ dashboardEditor.clickableBox } toggleClickableBox={ toggleClickableBox }/>
            <Sections element={ dashboardEditor.addElement } clickableBox={ dashboardEditor.clickableBox }/>
        </div>
        
    )
}