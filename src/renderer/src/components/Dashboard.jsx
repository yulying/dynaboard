import React from 'react'
import Navbar from './Navbar'
import Sections from './Sections'

export default function Dashboard() {
    const [clickableBox, setClickableBox] = React.useState(false)

    function toggleEditButton() {
        setClickableBox(prevClickable => !prevClickable)
    }

    return (
        <div>
            <Navbar clickableBox={ clickableBox } handleToggleEdit={ toggleEditButton }/>
            <Sections clickableBox={ clickableBox }/>
        </div>
        
    )
}