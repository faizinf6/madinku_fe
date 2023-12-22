import React, { useState } from 'react';

const ButtonGroup = ({ onChange }) => {
    const [active, setActive] = useState(''); // 'Putra' atau 'Putri'

    const handleClick = (value) => {
        setActive(value);
        onChange(value);
    };

    return (
        <div className="flex">
            <button
                className={`px-4 py-2 ${active === 'Pa' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 border border-pink-500'} rounded-l-full  `}
                onClick={() => handleClick('Pa')}
            >
                Putra
            </button>
            <button
                className={` px-4 py-2 ${active === 'Pi' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-800 border border-green-500'}  rounded-r-full`}
                onClick={() => handleClick('Pi')}
            >
                Putri
            </button>
        </div>
    );
};

export default ButtonGroup;
