import React, { useRef } from "react";
import Checkbox from "./Checkbox";

export default function Checklist(props) {
    const [label, setLabel] = React.useState("Checklist");
    const [checklistData, setChecklistData] = React.useState({
        checkboxes: [
            {
                checkboxID: 1,
                temporary: true,
            },
        ],
    });

    const [userInputed, setUserInputed] = React.useState(false);

    const clickRef = useRef(null);
    const [labelToInput, setLabelToInput] = React.useState(false);

    const [eraseID, setEraseID] = React.useState(-1);

    // Fetches initial data after initial render
    React.useEffect(() => {
        props.setStatusBar("Retrieving data...");

        fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api/checklist/${props.sectionID}`,
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    setChecklistData({
                        checkboxes: [
                            ...data.map((checkbox) => ({
                                checkboxID: checkbox.n_checkbox_id,
                                temporary: false,
                            })),
                            {
                                checkboxID:
                                    Math.max.apply(
                                        null,
                                        data.map((checkbox) => {
                                            return checkbox.n_checkbox_id;
                                        }),
                                    ) + 1,
                                temporary: true,
                            },
                        ],
                    });
                }
            })
            .catch((error) => console.log(error));

        fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api/sections/id/${props.sectionID}`,
        )
            .then((response) => response.json())
            .then((data) => {
                if (data[0].v_sec_label) {
                    setLabel(data[0].v_sec_label);
                }
            })
            .catch((error) => console.log(error));

        setUserInputed(true);
        props.setStatusBar("Data restored.");
    }, []);

    React.useEffect(() => {
        if (eraseID !== -1) {
            eraseCheckbox();
        }
    }, [eraseID]);

    // Create checkbox query
    async function createCheckbox() {
        const maxID = Math.max.apply(
            null,
            checklistData.checkboxes.map((checkbox) => {
                return checkbox.checkboxID;
            }),
        );

        setChecklistData({
            ...checklistData,
            checkboxes: [
                ...checklistData.checkboxes.map((checkbox) => {
                    if (checkbox.checkboxID === maxID) {
                        return { ...checkbox, temporary: false };
                    } else {
                        return checkbox;
                    }
                }),
                {
                    checkboxID: maxID + 1,
                    temporary: true,
                },
            ],
        });

        await props.createCheckbox(
            `/checklist/${props.sectionID}/checkbox/${maxID}`,
        );

        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${maxID}/check/false`,
        );
    }

    async function eraseCheckbox() {
        console.log("Clearing empty checkbox...");

        setChecklistData({
            ...checklistData,
            checkboxes: checklistData.checkboxes.filter(
                (item) => item.checkboxID !== eraseID,
            ),
        });

        await props.deleteCheckbox(
            `/checklist/${props.sectionID}/checkbox/${eraseID}`,
        );
    }

    React.useEffect(() => {
        const handler = function (event) {
            handleClickOutside(event);
        };

        function handleClickOutside(event) {
            if (clickRef.current && !clickRef.current.contains(event.target)) {
                setLabelToInput(false);
            }
        }

        // Bind the event listener
        if (labelToInput) {
            document.addEventListener("mousedown", handler);
        }

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handler);
        };
    });

    React.useEffect(() => {
        if (userInputed && labelToInput === true) {
            props.saveLabel(props.sectionID, label);
        }
    }, [label]);

    return (
        <div className="label-div">
            {!labelToInput && (
                <label htmlFor="checklist-element">
                    {label}
                    {props.editable && (
                        <span
                            className="label-editor"
                            onClick={() => setLabelToInput(true)}
                        >
                            {" "}
                            🖉
                        </span>
                    )}
                </label>
            )}
            {labelToInput && (
                <input
                    className="label-textbox"
                    ref={clickRef}
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                />
            )}

            <div className="checklist">
                {checklistData.checkboxes.map(function (item) {
                    return (
                        <div className="checkbox-item" key={item.checkboxID}>
                            <Checkbox
                                id={item.checkboxID}
                                editable={props.editable}
                                sectionID={props.sectionID}
                                checkboxID={item.checkboxID}
                                temporary={item.temporary}
                                createCheckbox={createCheckbox}
                                saveCheckbox={props.saveCheckbox}
                                eraseCheckbox={setEraseID}
                                setStatusBar={props.setStatusBar}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
