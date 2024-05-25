import React from "react";

export default function Navbar(props) {
    const [dashboard, setDashboard] = React.useState({
        addDropDown: false,
    });

    function clickAddSection() {
        setDashboard((dashboard) => ({
            ...dashboard,
            addDropDown: !dashboard.addDropDown,
        }));
    }

    function addNotepad() {}

    return (
        <div>
            <div id="navbar-empty-space" />
            <div id="navbar">
                <nav id="main-navbar-components">
                    <h3 id="dashboard-title">My Dashboard</h3>
                    <div id="dashboard-editor">
                        {/* { props.clickableBox && <span id="add-button" onClick={ clickAddSection }>ADD</span> } */}
                        <span
                            id="edit-button"
                            onClick={props.toggleClickableBox}
                        >
                            {props.clickableBox ? "DONE" : "EDIT"}
                        </span>
                        {!props.clickableBox && (
                            <span className="dashboard-settings">SETTINGS</span>
                        )}
                    </div>
                </nav>
                {/* Remove the add button for a submenu when clicking on a box */}
                {/* { props.clickableBox && dashboard.addDropDown && <div id="add-dropdown" onMouseLeave={ clickAddSection }>
                    <div className='dropdown-hover-element'>
                        <div className='dropdown-arrow' id='add-dropdown-arrow'/>
                    </div>
                    <span className='add-dropdown-option' onClick={addNotepad}>Notepad</span>
                    <span className='add-dropdown-option'>Calendar</span>
                    <span className='add-dropdown-option'>Checklist</span>
                </div> } */}
            </div>
        </div>
    );
}
