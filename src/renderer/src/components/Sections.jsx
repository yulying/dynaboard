import React from 'react'
import Notepad from './section-components/Notepad'
import Calendar from 'react-calendar'
import Checklist from './section-components/Checklist'
import Image from './section-components/Image'

export default function Sections(props) {
    // sectionID, componentType
    const [sections, setSections] = React.useState([])

    const [editor, setEditor] = React.useState({
        sectionID: 0,
        prevType: '',
        showOptions: false,
        change: false
    })

    // const [queryUrl, setQueryUrl] = React.useState('')
    const [fetchBody, setFetchBody] = React.useState({})

    const [counter, setCounter] = React.useState(10)

    // May change to state and create an admin type user later
    const options = ['Notepad', 'Checklist', 'Calendar']

    // GET Request - Initial Query
    React.useEffect(() => {
        fetch(`http://localhost:${import.meta.env.VITE_PORT}/all`)
            .then((response) => response.json())
            .then((data) => {
                let dataArr = []

                data.map(
                    (section) =>
                        (dataArr = [
                            ...dataArr,
                            {
                                sectionID: section.n_sec_id,
                                componentType: section.v_sec_type.toLowerCase()
                            }
                        ])
                )

                setSections(dataArr)
            })
            .catch((error) => console.log(error))
    }, [])

    // GET Request - General
    async function getSection(queryUrl) {
        return await fetch(`http://localhost:${import.meta.env.VITE_PORT}${queryUrl}`)
            .then((response) => response.json())
            .then((data) => {
                let dataArr = []

                data.map(
                    (section) =>
                        (dataArr = [
                            ...dataArr,
                            {
                                sectionID: section.n_sec_id,
                                componentType: section.v_sec_type.toLowerCase()
                            }
                        ])
                )

                setSections(dataArr)
            })
            .catch((error) => console.log(error))
    }

    // POST Request
    async function createSection(queryUrl) {
        return await fetch(`http://localhost:${import.meta.env.VITE_PORT}${queryUrl}`, {
            method: 'POST',
            body: JSON.stringify(fetchBody),
            header: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
    }

    // UPDATE Request
    async function updateSection(queryUrl) {
        return await fetch(`http://localhost:${import.meta.env.VITE_PORT}${queryUrl}`, {
            method: 'PUT',
            body: JSON.stringify(fetchBody),
            header: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
    }

    // DELETE Request
    async function deleteSection(queryUrl) {
        return await fetch(`http://localhost:${import.meta.env.VITE_PORT}${queryUrl}`, {
            method: 'DELETE'
        })
    }

    function toggleShowOptions(event, change = false) {
        const prevSection = sections.filter((section) => section.sectionID === event.target.id)

        setEditor((prevEditor) => {
            return {
                sectionID: event.target.id,
                prevType: prevSection.componentType,
                showOptions: !prevEditor.showOptions,
                change: change
            }
        })
    }

    async function createSectionURL(id, sectionType, generalDB = false) {
        if (generalDB) {
            return createSection(`/sections/${id}/type/${sectionType}`)
        } else if (sectionType !== 'checklist') {
            return createSection(`/${sectionType}/${id}`)
        }
    }

    // Create a NEW section
    async function applySection(sectionType) {
        if (editor.change) {
            updateSection(`/sections/${editor.sectionID}/type/${sectionType}`)
                .then(deleteSection(`/${editor.prevType}/${editor.sectionID}`))
                .then(createSectionURL(editor.sectionID, sectionType))
                .then(getSection(`/all`))

            // setSections(
            //     sections.map((section) => {
            //         if (section.sectionID === editor.sectionID) {
            //             return { ...section, componentType: sectionType }
            //         } else {
            //             return section
            //         }
            //     })
            // )
        } else {
            createSectionURL(counter, sectionType, true)
                .then(createSectionURL(counter, sectionType))
                .then(getSection(`/all`))

            // setSections((prevSections) => {
            //     return [
            //         ...prevSections,
            //         {
            //             sectionID: editor.sectionID,
            //             componentType: sectionType
            //         }
            //     ]
            // })

            setCounter(counter + 1)
        }

        setEditor((prevEditor) => ({
            ...prevEditor,
            showOptions: false,
            change: false
        }))

        // setCounter(counter + 1)
    }

    function editComponent(section_id) {
        return (
            <div className="edit-component">
                <span
                    className="change-section"
                    id={section_id}
                    onClick={(event) => toggleShowOptions(event, true)}
                >
                    ⟲
                </span>
                <span className="delete-section" id={section_id} onClick={deleteSection}>
                    DELETE
                </span>
            </div>
        )
    }

    function deleteSection(event) {
        const deleteSection = sections.filter((section) => section.sectionID === event.target.id)

        deleteSection(`/${deleteSection.componentType}/${event.target.id}`)
            .then(deleteSection(`/sections/${event.target.id}`))
            .then(getSection(`/all`))
        // setSections(sections.filter((section) => section.sectionID !== event.target.id))
    }

    function getComponent(section) {
        switch (section.componentType) {
            case 'notepad':
                return (
                    <div>
                        {props.clickableBox && editComponent(section.sectionID)}
                        <div
                            className={'sections' + (props.clickableBox ? '-hover' : '')}
                            id={section.id}
                        >
                            <Notepad editable={props.clickableBox} />
                        </div>
                    </div>
                )
            case 'checklist':
                return (
                    <div>
                        {props.clickableBox && editComponent(section.sectionID)}
                        <div
                            className={'sections' + (props.clickableBox ? '-hover' : '')}
                            id={section.id}
                        >
                            <Checklist editable={props.clickableBox} />
                        </div>
                    </div>
                )
            case 'calendar':
                return (
                    <div>
                        {props.clickableBox && editComponent(section.sectionID)}
                        <Calendar
                            className={'calendar' + (props.clickableBox ? '-hover' : '')}
                            id={section.id}
                        />
                    </div>
                )
            // Image upload does not work properly in React
            // case 'Image':
            //     return  <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id={section.id}><Image /></div>;
        }
    }

    const sectionComponents = sections.map((section) => getComponent(section))

    return (
        <div>
            {props.clickableBox && editor.showOptions && (
                <div id="options-menu" onMouseLeave={toggleShowOptions}>
                    {options.map((option) => (
                        <div className="option" onClick={() => applySection(option.toLowerCase())}>
                            {option}
                        </div>
                    ))}
                </div>
            )}
            <div className="grid-sections">
                {sectionComponents}
                <div>
                    {props.clickableBox && <div className="add-section-padding"></div>}
                    {props.clickableBox && (
                        <div className="add-new-section" id={counter} onClick={toggleShowOptions}>
                            +
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
