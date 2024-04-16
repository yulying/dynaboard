import React from 'react'
import Navbar from './components/Navbar'
import Sections from './components/Sections'

function App() {
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

export default App

