import React from "react";
import Select from "react-select";

export default function (props) {
    return (
        <Select
            isClearable
            placeholder={props.placeholder || "Filter"}
            options={props.options}
            onChange={props.onChange}
            {...props}
            maxMenuHeight={150}
        />
    );
}
