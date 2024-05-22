import React, { useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useClickAway } from 'react-use'
import { useDebouncedCallback } from 'use-debounce'

export default function Checklist(props) {
    const [counter, setCounter] = React.useState(1)

    const [checklistData, setChecklistData] = React.useState({
        label: 'Checklist',
        items: [
            {
                checkboxID: { counter },
                text: '',
                checked: false,
                temporary: true
            }
        ]
    })

    const ref = useRef(null)

    const saveChanges = useDebouncedCallback(async (checkbox_id) => {
        props.setStatusBar('Saving changes...')
        props.setFetchBody({ text: notepadData.text })
        await props.saveCheckbox(`/checklist/${props.sectionID}/checkbox/${checkbox_id}`)
        props.setStatusBar('Changes saved.')
    }, 1000)

    React.useEffect(() => {
        fetch(
            `http://localhost:${import.meta.env.VITE_PORT}/checklist/${props.sectionID}/largest_checkbox_id`
        )
            .then((response) => response.json())
            .then((data) => {
                setCounter(data[0].max + 1)
            })
            .catch((error) => console.log(error))
    }, [])

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
        const index = checklistData.items.findIndex((item) => item.checkboxID === event.target.id)

        setChecklistData((prevChecklistData) => {
            return {
                ...prevChecklistData,
                items: [
                    ...checklistData.items.slice(0, index),
                    {
                        ...checklistData.items[index],
                        checked: !item.checked
                    },
                    ...checklistData.items.slice(index + 1)
                ]
                // checklistData.items.map((item) => {
                //     if (item.checkboxID === event.target.id) {
                //         return { ...item, checked: !item.checked }
                //     } else {
                //         return item
                //     }
                // })
            }
        })

        await props.saveCheckbox(
            `/checklist/${props.sectionID}/checkbox/${checkbox_id}/check/${checklistData.items[index].checked}`
        )
    }

    async function handleChange(event) {
        const index = checklistData.items.findIndex(
            (item) => item.checkboxID.toString() === event.target.id
        )

        if (!checklistData.items[index].temporary) {
            setChecklistData({
                ...checklistData,
                items: [
                    ...checklistData.items.slice(0, index),
                    {
                        ...checklistData.items[index],
                        text: event.target.value
                    },
                    ...checklistData.items.slice(index + 1)
                ]
            })

            saveChanges()
        } else {
            // Creates a new checkbox
            setChecklistData({
                ...checklistData,
                items: [
                    ...checklistData.items.slice(0, index),
                    {
                        ...checklistData.items[index],
                        text: event.target.value,
                        temporary: false
                    },
                    ...checklistData.items.slice(index + 2),
                    {
                        checkboxID: counter,
                        text: '',
                        checked: false,
                        temporary: true
                    }
                ]
            })

            await props.createCheckbox(`/checklist/${props.sectionID}/checkbox/${event.target.id}`)
            await props.createCheckbox(
                `/checklist/${props.sectionID}/checkbox/${checkbox_id}/check/${checklistData.items[index].checked}`
            )

            saveChanges()
            setCounter(counter + 1)
        }
    }

    async function clearEmpty() {
        await props.deleteCheckbox(`/checklist/${props.sectionID}/delete_empty_checkbox`)

        setChecklistData({
            ...checklistData,
            items: checklistData.items.filter((item) => item.temporary || item.text !== '')
        })
    }

    const style = {
        font: 'inherit',
        width: '305px',
        resize: 'none',
        border: 'none',
        lineHeight: '1.3'
    }

    // How to deal with race conditions if use clicks away when saveChanges is called
    // const ref = useClickAway((event) => {
    //     clearEmpty(event.target.id)
    // })

    useClickAway(ref, () => {
        clearEmpty()
    })

    return (
        <div className="label-div">
            <label for="checklist-element">{checklistData.label}</label>
            <div className="checklist">
                {checklistData.items.map(function (item) {
                    return (
                        <div className="checkbox-item">
                            <input
                                type="checkbox"
                                className={(item.temporary && 'temporary-') + 'checkbox'}
                                id={item.checkboxID}
                                onClick={toggleChecked}
                                disabled={props.editable}
                            />
                            <TextareaAutosize
                                className={(item.temporary && 'temporary-') + 'checkbox-label'}
                                id={item.checkboxID}
                                minRows={1}
                                style={style}
                                onChange={handleChange}
                                ref={ref}
                                value={item.text}
                                disabled={props.editable}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
