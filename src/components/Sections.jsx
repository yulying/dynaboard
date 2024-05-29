import React from "react";
import Notepad from "./section-components/Notepad";
import Calendar from "react-calendar";
import Checklist from "./section-components/Checklist";
import Image from "./section-components/Image";

export default function Sections(props) {
    // sectionID, componentType
    const [sections, setSections] = React.useState([]);

    const [editor, setEditor] = React.useState({
        sectionID: 0,
        prevType: "",
        showOptions: false,
        change: false,
    });

    // const [queryUrl, setQueryUrl] = React.useState('')
    const [fetchBody, setFetchBody] = React.useState({});

    const [counter, setCounter] = React.useState(10);

    // May change to state and create an admin type user later
    const options = ["Notepad", "Checklist", "Calendar"];

    // GET Request - Initial Query
    React.useEffect(() => {
        fetch(`http://localhost:${import.meta.env.VITE_PORT}/api/all`)
            .then((response) => response.json())
            .then((data) => {
                let dataArr = [];

                data.map(
                    (section) =>
                        (dataArr = [
                            ...dataArr,
                            {
                                sectionID: section.n_sec_id,
                                componentType: section.v_sec_type.toLowerCase(),
                            },
                        ]),
                );

                setSections(dataArr);
            })
            .catch((error) => console.log(error));
    }, []);

    // GET Request - Initial Counter Query
    React.useEffect(() => {
        fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api/sections/largest-id`,
        )
            .then((response) => response.json())
            .then((data) => {
                setCounter(data[0].max + 1);
            })
            .catch((error) => console.log(error));
    }, []);

    // GET Request - Requests general GET requests
    async function getSection(queryUrl) {
        return await fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api${queryUrl}`,
        )
            .then((response) => response.json())
            .then((data) => {
                let dataArr = [];

                data.map(
                    (section) =>
                        (dataArr = [
                            ...dataArr,
                            {
                                sectionID: section.n_sec_id,
                                componentType: section.v_sec_type.toLowerCase(),
                            },
                        ]),
                );

                setSections(dataArr);
            })
            .catch((error) => console.log(error));
    }

    // POST Request - Controller posts to db from query URL only
    async function createSection(queryUrl) {
        return await fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api${queryUrl}`,
            {
                method: "POST",
                body: new URLSearchParams(fetchBody),
                header: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            },
        )
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.log(error));
    }

    // UPDATE Request - Controller deletes from component db and changes section in main db
    async function updateSection(queryUrl) {
        console.log("Fetch Body");
        console.log(fetchBody);
        return await fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api${queryUrl}`,
            {
                method: "PUT",
                header: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: new URLSearchParams(fetchBody),
            },
        )
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.log(error));
    }

    // DELETE Request - Controller deletes from component db and main db
    async function deleteSection(queryUrl) {
        return await fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api${queryUrl}`,
            {
                method: "DELETE",
            },
        ).catch((error) => console.log(error));
    }

    function toggleShowOptions(event, change = false) {
        const prevSection = sections.filter(
            (section) => section.sectionID === event.target.id,
        );

        setEditor((prevEditor) => {
            return {
                sectionID: event.target.id,
                prevType: prevSection.componentType,
                showOptions: !prevEditor.showOptions,
                change: change,
            };
        });
    }

    // Creates ⟲ and DELETE options when editing existing components and provides functionality for updating/deleting sections
    function showEditOptions(section_id) {
        return (
            <div className="edit-component">
                <span
                    className="change-section"
                    id={section_id}
                    onClick={(event) => toggleShowOptions(event, true)}
                >
                    ⟲
                </span>
                <span
                    className="delete-section"
                    id={section_id}
                    onClick={deleteSectionRequest}
                >
                    DELETE
                </span>
            </div>
        );
    }

    // Creates query URL for createSection
    async function createSectionURL(id, sectionType, generalDB = false) {
        if (generalDB) {
            return createSection(`/sections/${id}/type/${sectionType}`);
        } else if (sectionType !== "checklist") {
            return createSection(`/${sectionType}/${id}`);
        }
    }

    // Creates a new section and updates component databases
    async function createSectionRequest(sectionType) {
        if (editor.change) {
            await updateSection(
                `/sections/${editor.sectionID}/type/${sectionType}`,
            );
            // .then(deleteSection(`/${editor.prevType}/${editor.sectionID}`))
            await createSectionURL(editor.sectionID, sectionType);
            await getSection(`/all`);

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
            await createSectionURL(counter, sectionType, true);
            await createSectionURL(counter, sectionType);
            await getSection(`/all`);

            // setSections((prevSections) => {
            //     return [
            //         ...prevSections,
            //         {
            //             sectionID: editor.sectionID,
            //             componentType: sectionType
            //         }
            //     ]
            // })

            setCounter(counter + 1);
        }

        setEditor((prevEditor) => ({
            ...prevEditor,
            showOptions: false,
            change: false,
        }));
    }

    // Deletes all components from component db with section id and deletes from main db
    function deleteSectionRequest(event) {
        // const section = sections.filter((section) => section.sectionID === event.target.id)
        // console.log(section)

        // deleteSection(`/${section.componentType}/${event.target.id}`)
        deleteSection(`/sections/${event.target.id}`).then(getSection(`/all`));
        // setSections(sections.filter((section) => section.sectionID !== event.target.id))
    }

    // Creates individual element components for render
    function getComponent(section) {
        switch (section.componentType) {
            case "notepad":
                return (
                    <div>
                        {props.clickableBox &&
                            showEditOptions(section.sectionID)}
                        <div
                            className={
                                "sections" +
                                (props.clickableBox ? "-hover" : "")
                            }
                            id={section.id}
                        >
                            <Notepad
                                editable={props.clickableBox}
                                sectionID={section.sectionID}
                                saveText={updateSection}
                                setFetchBody={setFetchBody}
                                setStatusBar={props.setStatusBar}
                            />
                        </div>
                    </div>
                );
            case "checklist":
                return (
                    <div>
                        {props.clickableBox &&
                            showEditOptions(section.sectionID)}
                        <div
                            className={
                                "sections" +
                                (props.clickableBox ? "-hover" : "")
                            }
                            id={section.id}
                        >
                            <Checklist
                                editable={props.clickableBox}
                                sectionID={section.sectionID}
                                createCheckbox={createSection}
                                saveCheckbox={updateSection}
                                deleteCheckbox={deleteSection}
                                setFetchBody={setFetchBody}
                                fetchBody={fetchBody}
                                setStatusBar={props.setStatusBar}
                            />
                        </div>
                    </div>
                );
            case "calendar":
                return (
                    <div>
                        {props.clickableBox &&
                            showEditOptions(section.sectionID)}
                        <Calendar
                            className={
                                "calendar" +
                                (props.clickableBox ? "-hover" : "")
                            }
                            id={section.id}
                        />
                    </div>
                );
            // Image upload does not work properly in React
            // case 'Image':
            //     return  <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id={section.id}><Image /></div>;
        }
    }

    const sectionComponents = sections.map((section) => getComponent(section));

    return (
        <div>
            {props.clickableBox && editor.showOptions && (
                <div id="options-menu" onMouseLeave={toggleShowOptions}>
                    {options.map((option) => (
                        <div
                            className="option"
                            onClick={() =>
                                createSectionRequest(option.toLowerCase())
                            }
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
            <div className="grid-sections">
                {sectionComponents}
                <div>
                    {props.clickableBox && (
                        <div className="add-section-padding"></div>
                    )}
                    {props.clickableBox && (
                        <div
                            className="add-new-section"
                            id={counter}
                            onClick={toggleShowOptions}
                        >
                            +
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
