import React, { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Notepad(props) {
    const [label, setLabel] = React.useState("Notepad");
    const [notepadText, setNotepadText] = React.useState("");

    const [fetchBody, setFetchBody] = React.useState({});

    const [userInputed, setUserInputed] = React.useState(false);

    const clickRef = useRef(null);
    const [labelToInput, setLabelToInput] = React.useState(false);

    const saveChanges = useDebouncedCallback(async () => {
        props.setStatusBar("Saving changes...");
        setFetchBody({ text: notepadText });
    }, 1000);

    React.useEffect(() => {
        props.setStatusBar("Retrieving data...");

        fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/api/notepad/${props.sectionID}`,
        )
            .then((response) => response.json())
            .then((data) => {
                if (data[0].v_text) {
                    setNotepadText(data[0].v_text);
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
        if (userInputed) {
            updateTextQuery();
        }
    }, [fetchBody]);

    function handleChange(event) {
        setNotepadText(event.target.value);
        saveChanges();
    }

    // Save text query
    async function updateTextQuery() {
        await props.saveText(`/notepad/${props.sectionID}`, fetchBody);
        props.setStatusBar("Changes saved.");
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
                <label ref={clickRef} htmlFor="notepad-element">
                    {label}
                    {props.editable && (
                        <span
                            ref={clickRef}
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
            <textarea
                id="notepad-element"
                className="notepad"
                name="text"
                value={notepadText}
                placeholder="Type here"
                onChange={handleChange}
                disabled={props.editable}
            />
        </div>
    );
}
