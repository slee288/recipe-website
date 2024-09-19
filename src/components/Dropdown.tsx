import React, {ChangeEvent, FC} from "react";
import { DropdownOption } from "../lib/types";

const Dropdown: FC<{ 
    options: DropdownOption[];
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void
}> = ({
    options,
    name,
    value,
    onChange
}) => {
    return (
        <select className="
            bg-gray-50 disabled:bg-gray-300 border border-gray-300 rounded-lg block py-1.5 sm:py-2.5 px-2.5 sm:px-3.5 sm:min-w-28
        " name={name} value={value} onChange={onChange} disabled={options.length <= 1}>
            {options.map((option) => (
                <option value={option.value} key={option.key}>{option.label}</option>
            ))}
        </select>
    )
}

export default Dropdown;