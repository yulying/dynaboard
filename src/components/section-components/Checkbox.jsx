import React, { useRef } from "react";
import api from "../../utils/api";
import { useParams } from "react-router-dom";
import EventBus from "../../utils/EventBus";

import TextareaAutosize from "react-textarea-autosize";
import { useDebouncedCallback } from "use-debounce";

export default function Checkbox(props) {
    const [checkboxData, setCheckboxData] = React.useState({
        text: "",
        checked: false,
    });

    const [userInputed, setUserInputed] = React.useState(false);

    const [fetchBody, setFetchBody] = React.useState({});

    const clickRef = useRef(null);

    const [isClicked, setIsClicked] = React.useState(false);

    const { userId } = useParams();

    const toggle = () => setIsClicked(!isClicked);

    const style = {
        font: "inherit",
        width: "305px",
        resize: "none",
        border: "none",
        lineHeight: "1.2",
        color: "white",
        backgroundColor: "transparent",
    };

    const saveChanges = useDebouncedCallback(async () => {
        props.setStatusBar("Saving changes...");
        setFetchBody({ text: checkboxData.text });
    }, 1000);

    // Fetches initial data after initial render
    React.useEffect(() => {
        props.setStatusBar("Retrieving data...");

        api.get(
            `/${userId}/checklist/${props.sectionID}/checkbox/${props.checkboxID}`,
        )
            .then((response) => {
                if (response.data.length > 0) {
                    setCheckboxData({
                        ...checkboxData,
                        text: response.data[0].text,
                        checked: response.data[0].is_checked,
                    });
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                } else {
                    console.log(error);
                }
            });

        setUserInputed(true);
        props.setStatusBar("Data restored.");
    }, []);

    // waits for text to be stored into body request before calling actual query
    React.useEffect(() => {
        if (userInputed) {
            updateTextQuery();
        }
    }, [fetchBody]);

    // waits for checked to update before calling actual query
    React.useEffect(() => {
        if (userInputed) {
            updateCheckedQuery();
        }
    }, [checkboxData.checked]);

    React.useEffect(() => {
        const handler = function (event) {
            handleClickOutside(event);
        };

        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (
                userInputed &&
                clickRef.current &&
                !clickRef.current.contains(event.target)
            ) {
                clearEmpty();
            }

            setIsClicked(false);
        }
        // Bind the event listener
        document.addEventListener("mousedown", handler);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handler);
        };
    }, [isClicked, checkboxData.text]);

    async function handleChange(event) {
        setCheckboxData({
            ...checkboxData,
            text: event.target.value,
        });
        if (props.temporary) {
            // console.log("Creating new checkbox...");

            await props.createCheckbox();
        }

        saveChanges();
    }

    // Toggles checkbox - Cannot toggle if checkbox is empty
    async function toggleChecked() {
        setCheckboxData({
            ...checkboxData,
            checked: !checkboxData.checked,
        });

        props.setStatusBar("Changes saved.");
    }

    // Save text query
    async function updateTextQuery() {
        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${props.checkboxID}}`,
            fetchBody,
        );

        props.setStatusBar("Changes saved.");
    }

    // Save toggled checkbox setting query
    async function updateCheckedQuery() {
        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${props.checkboxID}/check/${checkboxData.checked}`,
        );
    }

    // race condition present: how to deal with updating database and deleting checkbox?
    async function clearEmpty() {
        if (checkboxData.text === "" && !props.temporary) {
            console.log(`Erasing empty checkbox... ${props.checkboxID}`);
            props.eraseCheckbox(props.checkboxID);
        }
    }

    return (
        <div>
            <input
                type="checkbox"
                className={(props.temporary && "temporary-") + "checkbox"}
                onChange={toggleChecked}
                checked={checkboxData.checked}
                disabled={props.editable}
            />
            <TextareaAutosize
                className={(props.temporary && "temporary-") + "checkbox-label"}
                minRows={1}
                style={style}
                onChange={(event) => handleChange(event)}
                onClick={toggle}
                ref={clickRef}
                value={checkboxData.text}
                readOnly={props.editable}
            />
        </div>
    );
}
