import React, { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useClickAway } from "react-use";
import { useDebouncedCallback } from "use-debounce";

export default function Checklist(props) {
    const [counter, setCounter] = React.useState(1);

    const [checklistData, setChecklistData] = React.useState({
        label: "Checklist",
        items: [
            {
                checkboxID: counter,
                text: "",
                checked: false,
                temporary: true,
            },
        ],
    });

    const [index, setIndex] = React.useState(0);

    const menuRef = useRef(null);
    const [listening, setListening] = React.useState(false);
    const [isClicked, setIsClicked] = React.useState(false);

    const toggleClicked = () => setIsClicked(true);

    const saveChanges = useDebouncedCallback(async () => {
        console.log(checklistData.items[index].text);
        props.setStatusBar("Saving changes...");
        props.setFetchBody({ text: checklistData.items[index].text });
        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${checklistData.items[index].checkboxID}`,
        );
        props.setStatusBar("Changes saved.");
    }, 2000);

    React.useEffect(() => {
        fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/checklist/${props.sectionID}/largest_checkbox_id`,
        )
            .then((response) => response.json())
            .then((data) => {
                setCounter(data[0].max + 1);
            })
            .catch((error) => console.log(error));
    }, []);

    React.useEffect(listenForOutsideClicks(listening, setListening, menuRef));

    // GET Request - Checks if checkbox with id exists
    // async function checkboxExists(queryUrl) {
    //     return await fetch(`http://localhost:${import.meta.env.VITE_PORT}/checklist${queryUrl}`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data[0].has_checkbox_id) {
    //                 return true
    //             }
    //             return false
    //         })
    //         .catch((error) => console.log(error))
    // }

    // Toggles checkbox - Cannot toggle if checkbox is empty
    async function toggleChecked(event) {
        console.log(typeof event.target.id);
        setIndex(
            checklistData.items.findIndex(
                (item) => item.checkboxID.toString() === event.target.id,
            ),
        );

        setChecklistData((prevChecklistData) => {
            return {
                ...prevChecklistData,
                items: [
                    ...checklistData.items.slice(0, index),
                    {
                        ...checklistData.items[index],
                        checked: !checklistData.items[index].checked,
                    },
                    ...checklistData.items.slice(index + 1),
                ],
            };
        });

        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${event.target.id}/check/${checklistData.items[index].checked}`,
        );
    }

    async function handleChange(event) {
        setIndex(
            checklistData.items.findIndex(
                (item) => item.checkboxID.toString() === event.target.id,
            ),
        );

        console.log(index);

        if (!checklistData.items[index].temporary) {
            setChecklistData({
                ...checklistData,
                items: [
                    ...checklistData.items.slice(0, index),
                    {
                        ...checklistData.items[index],
                        text: event.target.value,
                    },
                    ...checklistData.items.slice(index + 1),
                ],
            });

            await saveChanges();
        } else {
            // Creates a new checkbox
            setChecklistData({
                ...checklistData,
                items: [
                    ...checklistData.items.slice(0, index),
                    {
                        ...checklistData.items[index],
                        text: event.target.value,
                        temporary: false,
                    },
                    ...checklistData.items.slice(index + 2),
                    {
                        checkboxID: counter,
                        text: "",
                        checked: false,
                        temporary: true,
                    },
                ],
            });

            console.log("Making new checkbox entry...");

            await createCheckbox(event);

            setCounter(counter + 1);
        }
    }

    async function createCheckbox(event) {
        props.setStatusBar("Creating checkbox");

        await props.createCheckbox(
            `/checklist/${props.sectionID}/checkbox/${event.target.id}`,
        );

        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${event.target.id}/check/${checklistData.items[index].checked}`,
        );
        props.setStatusBar("Created.");

        await saveChanges();
    }

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
        // await props.deleteCheckbox(`/checklist/${props.sectionID}/delete_empty_checkbox`)

        setChecklistData({
            ...checklistData,
            items: checklistData.items.filter(
                (item) => item.temporary || item.text !== "",
            ),
        });
    }

    const style = {
        font: "inherit",
        width: "305px",
        resize: "none",
        border: "none",
        lineHeight: "1.3",
    };

    // How to deal with race conditions if use clicks away when saveChanges is called
    // const ref = useClickAway((event) => {
    //     clearEmpty(event.target.id)
    // })

    // useClickAway(menuRef, () => {
    //     console.log('Clicked Away')
    //     clearEmpty()
    // })

    return (
        <div className="label-div">
            <label htmlFor="checklist-element">{checklistData.label}</label>
            <div className="checklist">
                {checklistData.items.map(function (item) {
                    // console.log(`props.sectionID: ${item}`)
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
