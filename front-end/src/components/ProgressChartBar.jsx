import React from 'react';
import '../css/ProgressChartBar.css';

const ProgressBar = ({ progress, max }) => {
    // Calculate the percentage based on progress and total
    const percentage = (progress / max) * 100;

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-background">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }} // Set the width to the percentage of progress
                />
            </div>
            <div className="progress-label">
                {percentage > 100 ? 'Over Budget' : `${progress} CAD / ${max} CAD`}
            </div>
        </div>
    );
};

export default ProgressBar;
