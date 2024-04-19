import React from "react"
import Notepad from "./Notepad";

export default function Sections(props) { 
    // for future implementation
    const GRID_BLOCKS = 100;

    function addNotepad(event) {
            return <Notepad />
    }

    return (
        <div className="grid-sections">
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id="section-1">
                <Notepad />
            </div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id="section-2">
                
            </div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id="section-3">3</div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id="section-4">4</div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id="section-5">5</div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) } id="section-6">6</div>
        </div>

        // <div className="grid-sections">
        // {[...Array(GRID_BLOCKS)].map(number => <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) }></div> )}
        // </div>
    )
}