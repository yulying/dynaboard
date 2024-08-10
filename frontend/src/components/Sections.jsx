import React from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../utils/authService";
import EventBus from "../utils/EventBus";

import Notepad from "./section-components/Notepad";
import Calendar from "react-calendar";
import Checklist from "./section-components/Checklist";
import GoogleFiles from "./section-components/GoogleFiles";

import tapeArr from "../utils/tape";

export default function Sections(props) {
    const [sections, setSections] = React.useState([]);

    const [editor, setEditor] = React.useState({
        sectionID: 0,
        prevType: "",
        showOptions: false,
        change: false,
    });

    const [fetchBody, setFetchBody] = React.useState({});

    const [counter, setCounter] = React.useState(1);

    // May change to state and create an admin type user later
    const options = ["Notepad", "Checklist", "Calendar"]; // Add Google Files after debugging

    const { userId } = useParams();
    const navigate = useNavigate();

    // GET Request - Initial Query
    React.useEffect(() => {
        api.get(`/${userId}/all`)
            .then((response) => {
                let dataArr = [];

                response.data.map(
                    (section) =>
                        (dataArr = [
                            ...dataArr,
                            {
                                sectionID: section.section_id,
                                componentType:
                                    section.section_type.toLowerCase(),
                            },
                        ]),
                );

                setSections(dataArr);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                } else if (error.response && error.response.status === 403) {
                    if (authService.getCurrentUser()) {
                        authService.logout(userId);
                        EventBus.dispatch("logout");
                        alert("Session expired. Please log in again.");
                        navigate("/login");
                    }
                } else {
                    console.log(error);
                }
            });
    }, []);

    // GET Request - Initial Counter Query
    React.useEffect(() => {
        api.get(`/${userId}/sections/largest_id`)
            .then((response) => {
                if (response.data[0].max) {
                    setCounter(parseInt(response.data[0].max) + 1);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // GET Request - Requests general GET requests
    async function getSection(queryUrl) {
        return await api
            .get(`/${userId}${queryUrl}`)
            .then((response) => {
                let dataArr = [];

                response.data.map(
                    (section) =>
                        (dataArr = [
                            ...dataArr,
                            {
                                sectionID: section.section_id,
                                componentType:
                                    section.section_type.toLowerCase(),
                            },
                        ]),
                );

                setSections(dataArr);
                console.log(dataArr);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                } else if (error.response && error.response.status === 403) {
                    EventBus.dispatch("logout");
                    alert("Session expired. Please log in again.");
                    navigate("/login");
                } else {
                    console.log(error);
                }
            });
    }

    // POST Request - Controller posts to db from query URL only
    async function createSection(queryUrl) {
        return await api
            .post(`/${userId}${queryUrl}`, fetchBody)
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                } else if (error.response && error.response.status === 403) {
                    EventBus.dispatch("logout");
                    alert("Session expired. Please log in again.");
                    navigate("/login");
                } else {
                    console.log(error);
                }
            });
    }

    // UPDATE Request - Controller deletes from component db and changes section in main db
    async function updateSection(queryUrl, fetchBodyVar = {}) {
        return await api
            .put(`/${userId}${queryUrl}`, fetchBodyVar)
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                } else if (error.response && error.response.status === 403) {
                    EventBus.dispatch("logout");
                    alert("Session expired. Please log in again.");
                    navigate("/login");
                } else {
                    console.log(error);
                }
            });
    }

    // DELETE Request - Controller deletes from component db and main db
    async function deleteSection(queryUrl) {
        return await api.delete(`/${userId}${queryUrl}`).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("logout");
            } else if (error.response && error.response.status === 403) {
                EventBus.dispatch("logout");
                alert("Session expired. Please log in again.");
                navigate("/login");
            } else {
                console.log(error);
            }
        });
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

    // Creates CHANGE and DELETE options when editing existing components and provides functionality for updating/deleting sections
    function showEditOptions(section_id) {
        return (
            <div className="edit-component">
                <span
                    className="change-section"
                    id={section_id}
                    onClick={(event) => toggleShowOptions(event, true)}
                >
                    CHANGE
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

    function showNoLabelEditOptions(section_id) {
        return (
            <div className="no-label-edit-component">
                <span
                    className="change-section"
                    id={section_id}
                    onClick={(event) => toggleShowOptions(event, true)}
                >
                    CHANGE
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
        if (sectionType !== "calendar") {
            if (generalDB) {
                return createSection(`/sections/${id}/type/${sectionType}`);
            } else if (sectionType !== "checklist") {
                return createSection(`/${sectionType}/${id}`);
            }
        }
    }

    // Creates a new section and updates component databases
    async function createSectionRequest(sectionType) {
        let type = sectionType;

        if (sectionType === "google files") {
            type = "google";
        }

        if (editor.change) {
            await updateSection(
                `/sections/${editor.sectionID}/type/${type}`,
                fetchBody,
            );
            // .then(deleteSection(`/${editor.prevType}/${editor.sectionID}`))
            await createSectionURL(editor.sectionID, type);
            await getSection(`/all`);
        } else {
            await createSectionURL(counter, type, true); // Creates a new entry in general db and section db
            await createSectionURL(counter, type);
            await getSection(`/all`);

            setCounter(counter + 1);
        }

        setEditor((prevEditor) => ({
            ...prevEditor,
            showOptions: false,
            change: false,
        }));
    }

    // Updates section label; Mainly passed into components as props
    async function updateSectionLabel(sectionID, label) {
        await updateSection(`/sections/${sectionID}/label/${label}`);
    }

    // Deletes all components from component db with section id and deletes from main db
    async function deleteSectionRequest(event) {
        await deleteSection(`/sections/${event.target.id}`);
        await getSection(`/all`);
    }

    // Creates individual element components for render
    function getComponent(section) {
        switch (section.componentType) {
            case "notepad":
                return (
                    <div key={section.sectionID}>
                        {props.clickableBox &&
                            showEditOptions(section.sectionID)}
                        <div
                            className={
                                "sections" +
                                (props.clickableBox ? "-hover" : "")
                            }
                            id={section.id}
                        >
                            <img
                                src={
                                    tapeArr[
                                        Math.floor(
                                            Math.random() * tapeArr.length,
                                        )
                                    ]
                                }
                                className="section-tape"
                            />
                            <Notepad
                                editable={props.clickableBox}
                                sectionID={section.sectionID}
                                saveLabel={updateSectionLabel}
                                saveText={updateSection}
                                setFetchBody={setFetchBody}
                                setStatusBar={props.setStatusBar}
                            />
                        </div>
                    </div>
                );
            case "checklist":
                return (
                    <div key={section.sectionID}>
                        {props.clickableBox &&
                            showEditOptions(section.sectionID)}
                        <div
                            className={
                                "sections" +
                                (props.clickableBox ? "-hover" : "")
                            }
                            id={section.id}
                        >
                            <img
                                src={
                                    tapeArr[
                                        Math.floor(
                                            Math.random() * tapeArr.length,
                                        )
                                    ]
                                }
                                className="section-tape"
                            />
                            <Checklist
                                editable={props.clickableBox}
                                sectionID={section.sectionID}
                                createCheckbox={createSection}
                                saveLabel={updateSectionLabel}
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
                    <div key={section.sectionID}>
                        {props.clickableBox &&
                            showNoLabelEditOptions(section.sectionID)}
                        <div
                            className={
                                "sections" +
                                (props.clickableBox ? "-hover" : "")
                            }
                            id={section.id}
                        >
                            <img
                                src={
                                    tapeArr[
                                        Math.floor(
                                            Math.random() * tapeArr.length,
                                        )
                                    ]
                                }
                                className="section-tape"
                            />
                            <Calendar
                                className={
                                    "calendar" +
                                    (props.clickableBox ? "-hover" : "")
                                }
                                id={section.id}
                            />
                        </div>
                    </div>
                );
            case "google":
                return (
                    <div key={section.sectionID}>
                        {props.clickableBox &&
                            showEditOptions(section.sectionID)}
                        <div
                            className={
                                "sections" +
                                (props.clickableBox ? "-hover" : "")
                            }
                            id={section.id}
                        >
                            <img
                                src={
                                    tapeArr[
                                        Math.floor(
                                            Math.random() * tapeArr.length,
                                        )
                                    ]
                                }
                                className="section-tape"
                            />
                            <GoogleFiles
                                editable={props.clickableBox}
                                sectionID={section.sectionID}
                                saveLabel={updateSectionLabel}
                                saveData={updateSection}
                                setStatusBar={props.setStatusBar}
                            />
                        </div>
                    </div>
                );
        }
    }

    // const sectionComponents = sections.map((section) => getComponent(section));

    return (
        <div>
            {props.clickableBox && editor.showOptions && (
                <div id="options-menu" onMouseLeave={toggleShowOptions}>
                    {options.map((option) => (
                        <div
                            key={option.toLowerCase()}
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
                {sections.map((section) => getComponent(section))}
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
