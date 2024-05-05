import React from "react"
import Notepad from "./section-components/Notepad";
import Calendar from 'react-calendar';
import Checklist from "./section-components/Checklist";
import Image from "./section-components/Image";
import { terminal } from 'virtual:terminal';

export default function Sections(props) { 
    // sectionID, componentType
    const [sections, setSections] = React.useState([])

    const [editor, setEditor] = React.useState({
        sectionID: 0,
        showOptions: false,
        change: false
    })

    const [counter, setCounter] = React.useState(1)
    
    // May change to state and create an admin type user later
    const options = ["Notepad", "Calendar", "Checklist"]

    function toggleShowOptions(event, change=false) {
        setEditor(prevEditor => ({
            ...prevEditor,
            sectionID: event.target.id,
            showOptions: !prevEditor.showOptions,
            change: change
        }))
    }

    // Create a NEW section
    function applySection(sectionType) {

        terminal.log(editor.change)
        if (editor.change) {
            terminal.log("Changing")
            setSections(sections.map(section => {
                if (section.sectionID === editor.sectionID) {
                    return {...section, componentType: sectionType}
                }
                else {
                    return section
                }
            }))
        }
        else {
            setSections(prevSections => {
                return [...prevSections, {
                    sectionID: editor.sectionID,
                    componentType: sectionType
                }]
            })
        }

        setEditor(prevEditor => ({
            ...prevEditor,
            showOptions: false,
            change: false
        }))

        // terminal.log(sections)

        setCounter(counter + 1)
    }

    // When editing an EXISTING section, change section
    function changeSectionType(event) {

    }

    function deleteSection(event) {
        setSections(sections.filter(section => section.sectionID !== event.target.id))
    }

    function getComponent(section) {
        switch(section.componentType) {
            case 'Notepad':
                return (
                    <div>
                        { props.clickableBox && editComponent(section.sectionID) }
                        <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id={section.id}><Notepad editable={ props.clickableBox } /></div>
                    </div>
                )
            case 'Calendar':
                return (
                    <div>
                        { props.clickableBox && editComponent(section.sectionID) }
                        <Calendar className={ "calendar" + ( props.clickableBox ? "-hover" : "" ) } id={section.id} />
                    </div>
                )
            case 'Checklist':
                return (
                    <div>
                        { props.clickableBox && editComponent(section.sectionID) }
                        <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id={section.id}><Checklist editable={ props.clickableBox } /></div>
                    </div>
                )
            // Image upload does not work properly in React
                // case 'Image':
            //     return  <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id={section.id}><Image /></div>;

        }
    }

    function editComponent(section_id) {
        return (
            <div className="edit-component">
                <span className="change-section" id={section_id} onClick={(event) => toggleShowOptions(event, true)}>⟲</span>
                <span className="delete-section" id={section_id} onClick={deleteSection}>DELETE</span>
            </div>
        )
    }

    const sectionComponents = sections.map(section => getComponent(section))
    
    return (
        <div>
            { props.clickableBox && editor.showOptions && <div id="options-menu" onMouseLeave={toggleShowOptions}>
                {options.map(option => <div className="option" onClick={() => applySection(option)}>{option}</div>)}    
            </div>}
            <div className="grid-sections">
                { sectionComponents }
                <div>
                    { props.clickableBox && <div className="add-section-padding"></div> }
                    { props.clickableBox && <div className="add-new-section" id={counter} onClick={toggleShowOptions}>+</div>}
                </div>
                
            </div>
        </div>
        
    )
}