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
        <nav className="dashboard-navbar">
            <h3 className="dashboard-title">My Dashboard</h3>
            <div className="dashboard-editor">
                <span className="add-section-button" onClick={ clickAddSection }>ADD</span>
                { dashboard.addDropDown && <div className="add-section-dropdown-options">
                    <p>Notepad</p>
                    <p>Calendar</p>
                    <p>Checklist</p>
                </div> }
                <span className="edit-dashboard-sections" onClick={ props.handleToggleEdit }>{
                    props.clickableBox ? "DONE" : "EDIT" 
                }</span>
                <span className="dashboard-settings">SETTINGS</span>
            </div>
        </nav>
    )
}