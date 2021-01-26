import React from "react";
import SystemMessages from "./SystemMessages";


export const displaySystemMessage = (props) => {

    if(props !== undefined && props !== null) {
        if (props.errorMessage !== undefined) {
            return (<SystemMessages msgType={props.errorMessage.messageType} msgContent={props.errorMessage.message}/>);
        } else if (props.message !== null) {
            return (<SystemMessages msgType={props.messageType} msgContent={props.message}/>);
        } else {
            return null;
        }
    }

    return null;

}