import React from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Notepad(props) {
    const [notepadData, setNotepadData] = React.useState({
        label: "NOTEPAD",
        text: "",
    });

    const saveChanges = useDebouncedCallback(async () => {
        props.setStatusBar("Saving changes...");
        props.setFetchBody({ text: notepadData.text });
        await props.saveText(`/notepad/${props.sectionID}`);
        props.setStatusBar("Changes saved.");
    }, 1000);

    React.useEffect(() => {
        fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/notepad/${props.sectionID}`,
        )
            .then((response) => response.json())
            .then((data) => {
                if (data[0].v_text) {
                    setNotepadData({
                        ...notepadData,
                        text: data[0].v_text,
                    });
                } else {
                    setNotepadData({
                        ...notepadData,
                        text: "",
                    });
                }
            })
            .catch((error) => console.log(error));
    }, []);

    function handleChange(event) {
        setNotepadData({
            ...notepadData,
            text: event.target.value,
        });

        saveChanges();
    }

    return (
        <div className="label-div">
            <label htmlFor="notepad-element">{notepadData.label}</label>
            <textarea
                id="notepad-element"
                className="notepad"
                name="text"
                value={notepadData.text}
                placeholder="Type here"
                onChange={handleChange}
                disabled={props.editable}
            />
        </div>
    );
}
