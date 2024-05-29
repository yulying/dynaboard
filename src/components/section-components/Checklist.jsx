import React, { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useClickAway } from "react-use";
import { useDebouncedCallback } from "use-debounce";

export default function Checklist(props) {
    const [checklistData, setChecklistData] = React.useState({
        label: "Checklist",
        items: [],
    });

    const [toSave, setToSave] = React.useState({
        index: 0,
        text: "",
    });

    const menuRef = useRef(null);

    const [listening, setListening] = React.useState(false);
    const [isClicked, setIsClicked] = React.useState(false);

    const [saveText, setSaveText] = React.useState(false);
    const [toggleBox, setToggleBox] = React.useState(false);
    const [calledHere, setCalledHere] = React.useState(false);

    const toggleClicked = () => setIsClicked(true);

    const saveChanges = useDebouncedCallback(async () => {
        console.log("Text");
        console.log(checklistData.items[toSave.index].text);
        console.log(toSave.text);
        props.setStatusBar("Saving changes...");
        props.setFetchBody({ text: toSave.text });
        setCalledHere(true);
    }, 2000);

    const style = {
        font: "inherit",
        width: "305px",
        resize: "none",
        border: "none",
        lineHeight: "1.3",
    };

    // Fetches initial data after initial render
    React.useEffect(() => {
        props.setStatusBar("Retrieving data...");

        fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api/checklist/${props.sectionID}`,
        )
            .then((response) => response.json())
            .then((data) => {
                setChecklistData({
                    ...checklistData,
                    items: [
                        ...data.map((checkbox) => ({
                            checkboxID: checkbox.n_checkbox_id,
                            text: checkbox.v_text,
                            checked: checkbox.is_checked,
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
                            text: "",
                            checked: false,
                            temporary: true,
                        },
                    ],
                });
            })
            .catch((error) => console.log(error));
        props.setStatusBar("Data restored.");
    }, []);

    // Listens for clicks outside of component
    React.useEffect(listenForOutsideClicks(listening, setListening, menuRef));

    // Called after index of event that triggers handleChange is set
    React.useEffect(() => {
        if (saveText) {
            if (!checklistData.items[toSave.index].temporary) {
                console.log("Not new");
                console.log(checklistData.items);
                setChecklistData({
                    ...checklistData,
                    items: [
                        ...checklistData.items.slice(0, toSave.index),
                        {
                            ...checklistData.items[toSave.index],
                            text: toSave.text,
                        },
                        ...checklistData.items.slice(toSave.index + 1),
                    ],
                });

                console.log("Saving text to db");

                saveChanges();
            } else {
                // Creates a new checkbox
                console.log(
                    Math.max.apply(
                        null,
                        checklistData.items.map((checkbox) => {
                            return checkbox.checkboxID;
                        }),
                    ) + 1,
                );
                console.log("New checkbox");
                setChecklistData({
                    ...checklistData,
                    items: [
                        ...checklistData.items.slice(0, toSave.index),
                        {
                            ...checklistData.items[toSave.index],
                            text: toSave.text,
                            temporary: false,
                        },
                        {
                            checkboxID:
                                Math.max.apply(
                                    null,
                                    checklistData.items.map((checkbox) => {
                                        return checkbox.checkboxID;
                                    }),
                                ) + 1,
                            text: "",
                            checked: false,
                            temporary: true,
                        },
                    ],
                });

                console.log("Making new checkbox entry...");

                createCheckbox();
            }

            setSaveText(false);
        } else if (toggleBox) {
            setChecklistData((prevChecklistData) => {
                return {
                    ...prevChecklistData,
                    items: [
                        ...checklistData.items.slice(0, toSave.index),
                        {
                            ...checklistData.items[toSave.index],
                            checked: !checklistData.items[toSave.index].checked,
                        },
                        ...checklistData.items.slice(toSave.index + 1),
                    ],
                };
            });

            saveCheckedSetting();

            setToggleBox(false);
        } else {
            console.log("Handle change error.");
        }
    }, [toSave]);

    // Waits for fetchBody to finish setting in props before calling actually query
    React.useEffect(() => {
        if (calledHere) {
            saveTextQuery();
        } else {
            console.log("Save text query error.");
        }
    }, [props.fetchBody]);

    async function handleChange(event) {
        setToSave({
            index: checklistData.items.findIndex(
                (item) => item.checkboxID.toString() === event.target.id,
            ),
            text: event.target.value,
        });

        setSaveText(true);
    }

    // Toggles checkbox - Cannot toggle if checkbox is empty
    async function toggleChecked(event) {
        setToSave({
            ...toSave,
            index: checklistData.items.findIndex(
                (item) => item.checkboxID.toString() === event.target.id,
            ),
        });

        setToggleBox(true);
    }

    // Create checkbox query
    async function createCheckbox() {
        await props.createCheckbox(
            `/checklist/${props.sectionID}/checkbox/${checklistData.items[toSave.index].checkboxID}`,
        );

        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${checklistData.items[toSave.index].checkboxID}/check/${checklistData.items[toSave.index].checked}`,
        );

        await saveChanges();
    }

    // Save text query
    async function saveTextQuery() {
        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${checklistData.items[toSave.index].checkboxID}`,
        );

        props.setStatusBar("Changes saved.");
    }

    // Save toggled checkbox setting query
    async function saveCheckedSetting(id) {
        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${checklistData.items[toSave.index].checkboxID}/check/${checklistData.items[toSave.index].checked}`,
        );
    }

    // How to deal with race conditions if use clicks away when saveChanges is called

    function listenForOutsideClicks(listening, setListening, menuRef) {
        return () => {
            if (listening) return;
            if (!menuRef.current) return;
            setListening(true);
            [`click`, `touchstart`].forEach((type) => {
                document.addEventListener(`click`, () => {
                    if (isClicked) {
                        clearEmpty();
                    }
                });
            });
        };
    }

    async function clearEmpty() {
        console.log("Clicked Away");
        setIsOpen(false);

        const emptyCheckboxArr = checklistData.items.filter(
            (item) => !item.temporary && item.text === "",
        );

        setChecklistData({
            ...checklistData,
            items: checklistData.items.filter(
                (item) => item.temporary || item.text !== "",
            ),
        });

        emptyCheckboxArr.map(async (checkbox) => {
            await props.deleteCheckbox(
                `http://localhost:8080/api/checklist/${props.sectionID}/checkbox/${checkbox.checkboxID}`,
            );
        });
    }

    console.log(checklistData.items);

    return (
        <div className="label-div">
            <label htmlFor="checklist-element">{checklistData.label}</label>
            <div className="checklist">
                {checklistData.items.map(function (item) {
                    return (
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                className={
                                    (item.temporary && "temporary-") +
                                    "checkbox"
                                }
                                id={item.checkboxID}
                                onClick={toggleChecked}
                                disabled={props.editable}
                            />
                            <TextareaAutosize
                                className={
                                    (item.temporary && "temporary-") +
                                    "checkbox-label"
                                }
                                id={item.checkboxID}
                                minRows={1}
                                style={style}
                                onChange={handleChange}
                                onClick={toggleClicked}
                                ref={menuRef}
                                value={item.text}
                                disabled={props.editable}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
