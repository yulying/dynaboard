import React from "react"

export default function Sections(props) { 
    return (
        <div className="grid-sections">
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) }>1</div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) }>2</div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) }>3</div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) }>4</div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) }>5</div>
            <div className={ "sections" + ( props.clickableBox ? "-hover" : "" ) }>6</div>
        </div>
    )
}