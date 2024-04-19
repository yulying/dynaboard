import React from "react";
import { terminal } from 'virtual:terminal'

export default function Notepad() {
    const [notepadData, setNotepadData] = React.useState({
        label: "NOTEPAD",
        text: ""
    })


    function handleChange(event) {
        setNotepadData(prevNotepadData => {
            return {
                ...prevNotepadData,
                [event.target.name]: event.target.value
            }
        })
    }
    return (
        <div className="notepad-div">

            <label for="notepad-element">{ notepadData.label }</label>
            <textarea
                id="notepad-element"
                className="notepad"
                name="text"
                value={ notepadData.text }
                placeholder="Type here"
                onChange={ handleChange }
            />
        </div>
    )
}