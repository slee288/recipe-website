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
        <select className="bg-gray-50 border border-gray-300 rounded-lg block p-2.5 min-w-28" name={name} value={value} onChange={onChange}>
            {options.map((option) => (
                <option value={option.value} key={option.key}>{option.label}</option>
            ))}
        </select>
    )
}

export default Dropdown;