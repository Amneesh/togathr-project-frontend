import React, { useState } from 'react';

const TextToggle = ({ text, maxLength }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleText = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <p>
                {isExpanded ? text : `${text.substring(0, maxLength)}...`}
                {text.length > maxLength && (
                    <span onClick={toggleText} className='text-toggle' style={{ cursor: 'pointer'}}>
                        {isExpanded ? ' less' : 'more'}
                    </span>
                )}
            </p>
        </div>
    );
};

export default TextToggle;