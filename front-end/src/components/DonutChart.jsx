import React from 'react';
import ReactApexChart from 'react-apexcharts';

const DonutChart = ({ data, labels, position }) => {

    const options = {
        chart: {
            type: 'donut',
        
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '80%',
                    labels: {
                        show: false,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
            },
        },
        dataLabels: {
            enabled: false, // Enable data labels
        },
        labels: labels || [],
        colors: [ 'var(--primary-green)', 'var(--primary-purple)', 'var(--accent-yellow)', 'var(--accent-pink)', 'var(--accent-blue)', 'var(--primary-black)'],
        tooltip: {
            enabled: true,
            custom: function ({ seriesIndex, series, dataPointIndex, w }) {
                // Customize the tooltip text
                const value = series[seriesIndex];
                const label = w.globals.labels[seriesIndex];

                // Return a custom tooltip HTML
                return `
                    <div class="custom-tooltip">
                        <strong>${label}</strong><br />
                        Value: $${value}<br />
                        Percentage: ${((value / w.globals.seriesTotals.reduce((a, b) => a + b, 0)) * 100).toFixed(2)}% 
                    </div>
                `;
            },
        },
        legend: {
            position: position,
            verticalAlign: 'middle',
            horizontalAlign: 'center',
            itemMargin: {
                vertical: 4,
            },
        },
    };

    return (
        <div>
            <ReactApexChart options={options} series={data} type="donut" />
        </div>
    );
};

export default DonutChart;
