import React from "react"
import Notepad from "./section-components/Notepad";
import Calendar from 'react-calendar';
import Checklist from "./section-components/Checklist";
import { terminal } from 'virtual:terminal';

export default function Sections(props) { 
    const [sections, setSections] = React.useState([])

    const [editor, setEditor] = React.useState({
        sectionID: 0,
        showOptions: false,
        optionType: "" // Obsolete?
    })

    const [counter, setCounter] = React.useState(1)
    
    // May change to state and create an admin type user later
    const options = ["Notepad", "Calendar", "Checklist"]

    function toggleShowOptions(event) {
        setEditor(prevEditor => ({
            ...prevEditor,
            sectionID: event.target.id,
            showOptions: !prevEditor.showOptions
        }))
    }

    // Create a NEW section
    function addNewSection(sectionType) {
        setEditor(prevEditor => ({
            ...prevEditor,
            showOptions: false
        }))

        setSections(prevSections => {
            return [...prevSections, {
                sectionID: editor.sectionID,
                componentType: sectionType
            }]
        })

        setCounter(counter + 1)
    }

    // When editing an EXISTING section, change section
    function changeSectionType(event) {

    }

    function getComponent(section) {
        switch(section.componentType) {
            case 'Notepad':
                return <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id={section.id}><Notepad /></div>;
            case 'Calendar':
                return <Calendar className={ "calendar" + ( props.clickableBox ? "-hover" : "" ) } id={section.id} />;
            case 'Checklist':
                return <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id={section.id}><Checklist /></div>;

        }
    }

    const sectionComponents = sections.map(section => getComponent(section))
    
    return (
        <div>
            { props.clickableBox && editor.showOptions && <div id="options-menu" onMouseLeave={toggleShowOptions}>
                {options.map(option => <div className="option" onClick={() => editor.sectionID === counter.toString() ? addNewSection(option) : terminal.log(false)}>{option}</div>)}    
            </div>}
            <div className="grid-sections">
                { sectionComponents }
                { props.clickableBox && <div className="add-new-section" id={counter} onClick={toggleShowOptions}>+</div>}
            </div>
        </div>
        
    )
}