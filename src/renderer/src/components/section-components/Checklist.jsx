import React from "react";
import { terminal } from 'virtual:terminal';

export default function Checklist() {
    const [checklistData, setChecklistData] = React.useState({
        label: "Checklist",
        items: [{
            checkboxID: 0,
            text: "",
            checked: false,
            temporary: true
        }]
    })

    const [counter, setCounter] = React.useState(1)

    function toggleChecked(event) {
        setChecklistData(prevChecklistData => {
            return {
                ...prevChecklistData,
                items: checklistData.items.map(item => {
                    if (item.checkboxID === event.target.id) {
                        return {...item, checked: !item.checked}
                    } else {
                        return item;
                    }
                })
            }
        })
    }


    function handleChange(event) {
        const index = checklistData.items.findIndex((item) => item.checkboxID.toString() === event.target.id);

        if (!checklistData.items[index].temporary) {
            setChecklistData({
                ...checklistData,
                items: [
                    ...checklistData.items.slice(0,index),
                    {
                        ...checklistData.items[index],
                        text: event.target.value
                    },
                    ...checklistData.items.slice(index+1)
                ]
            })   
        }
        else {
            setChecklistData({
                ...checklistData,
                items: [
                    ...checklistData.items.slice(0,index),
                    {
                        ...checklistData.items[index],
                        text: event.target.value,
                        temporary: false
                    },
                    ...checklistData.items.slice(index+2),
                    {
                        checkboxID: counter,
                        text: "",
                        checked: false,
                        temporary: true
                    }
                ]
            })   
            
            setCounter(counter + 1)
        }
    }

    function clearEmpty() {
        setChecklistData ({
            ...checklistData,
            items: checklistData.items.filter(item => item.text !== "")
        })
    }
    
    return (
        <div className="label-div">
            <label for="checklist-element">{ checklistData.label }</label>
            <div className="checklist">
                { checklistData.items.map(function(item) {
                    return (
                        <div className="checkbox-item">
                            <input type="checkbox" id={ item.checkboxID } onClick={ toggleChecked } />
                            <textarea classname={(item.temporary && "temporary-") + "checkbox-label"} id={ item.checkboxID } onChange={ handleChange } value={item.text} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}