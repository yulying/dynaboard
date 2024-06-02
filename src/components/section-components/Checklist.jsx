import React from "react";
import Checkbox from "./Checkbox";

export default function Checklist(props) {
    const [checklistData, setChecklistData] = React.useState({
        label: "Checklist",
        checkboxes: [
            {
                checkboxID: 1,
                temporary: true,
            },
        ],
    });

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
                        ...checklistData,
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

        props.setStatusBar("Data restored.");
    }, []);

    React.useEffect(() => {
        if (eraseID !== -1) {
            console.log(eraseID);
            eraseCheckbox();
        }
    }, [eraseID]);

    // Create checkbox query
    async function createCheckbox() {
        console.log("Creating new checkbox in Checklist");
        const maxID = Math.max.apply(
            null,
            checklistData.checkboxes.map((checkbox) => {
                return checkbox.checkboxID;
            }),
        );

        await props.createCheckbox(
            `/checklist/${props.sectionID}/checkbox/${maxID}`,
        );

        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${maxID}/check/false`,
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

    // console.log(checklistData.checkboxes);

    return (
        <div className="label-div">
            <label htmlFor="checklist-element">{checklistData.label}</label>
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
