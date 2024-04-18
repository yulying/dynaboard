import React from 'react';

export default function Navbar(props) {
    const [dashboard, setDashboard] = React.useState( {
        addDropDown: false
    });
    
    function clickAddSection() {
        setDashboard(dashboard => ({
            ...dashboard,
            addDropDown: !dashboard.addDropDown
        }))
    }

    return (
        <div className='dashboard'>
            <nav className="dashboard-navbar">
                <h3 className="dashboard-title">My Dashboard</h3>
                <div className="dashboard-editor">
                    { !props.clickableBox && <span className="add-section-button" onClick={ clickAddSection }>ADD</span> }
                    <span className="edit-dashboard-sections" onClick={ props.handleToggleEdit }>{
                        props.clickableBox ? "DONE" : "EDIT" 
                    }</span>
                    { !props.clickableBox && <span className="dashboard-settings">SETTINGS</span> }
                </div>
            </nav>
            {/* { dashboard.addDropDown && <div className='dropdown-arrow' id='add-dropdown-arrow'/> } */}
            { dashboard.addDropDown && <div className="add-dropdown">
                <div className='dropdown-arrow' id='add-dropdown-arrow'/>
                <span className='add-dropdown-option'>Notepad</span>
                <span className='add-dropdown-option'>Calendar</span>
                <span className='add-dropdown-option'>Checklist</span>
            </div> }
        </div>
    )
}