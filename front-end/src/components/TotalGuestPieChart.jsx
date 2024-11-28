import React, { useEffect, useState } from 'react'
import ApexCharts from 'apexcharts'
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import AOS from "aos";
import "aos/dist/aos.css";

const TotalGuestPieChart = ({ timeLineData, donutData , barData }) => {
  useEffect(() => {
    AOS.init({
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);
  console.log('length', timeLineData);
  console.log('donutData', donutData);
console.log('Bardata', barData);
  const [series_invited_guest, set_series_invited_guest] = useState([
    {
      data: [donutData.accepted]
    }
  ]);
  const [series_total_guest_list, set_series_total_guest_list] = useState(Object.values(donutData));
  const [totalGuestLength, setTotalGuestLength] = useState(null);
  const [acceptedLength, setExpectedLength] = useState('');
  const options_total_guest_list = {
    labels: ["Uninvited", "Invited", "Accepted", "Declined", "Tentative"],
    chart: {
      type: 'donut',
      width: '400px' // Set the width of the chart
    },
    plotOptions: {
      pie: {
        donut: {
          size: '80%' // Adjust the size of the donut
        }
      }
    },
    fill: {
      colors: ['#5E11C9', '#FFB700', '#60EFFF', '#8C8C8C', '#fc03e3'] // Custom colors for each slice
    },
    tooltip: {
      enabled: true, // Enable tooltips
      formatter: function (val) {
        return val + "%"; // Format tooltip content
      }
    },
    dataLabels: {
      enabled: false, // Enable data labels
    },
    stroke: {
      width: 2 // Width of the stroke around the slices
    }
  };


  // const series_total_guest_list = [8, 0, 0, 0, 0]; // Data for the pie chart


  //   const series_invited_guest = [
  //     {
  //     data: [lineGraphData]
  //   }
  // ];

  useEffect(() => {



    set_series_total_guest_list(Object.values(donutData));
    const totalSum = Object.values(donutData).reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    setTotalGuestLength(totalSum);

    set_series_invited_guest([
      {
        data: [donutData.accepted],
      }
    ]);

    setExpectedLength(donutData.accepted);

  }, [donutData]);

  const options_invited_guest = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: 'end',
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return Math.round(val); // Round to the nearest whole number
    }
    },
    fill: {
      colors: ['#60EFFF'] // Bar colors
    },
    xaxis: {
      max: totalGuestLength,
      categories: [
        'RSVP'
      ],
    },

  };


  return (
    <section className="guestCharts">


      <div className="guest-all-charts">
        <div className="guest-donut" data-aos="zoom-out-up">
          <h5>Total Guests</h5>

          <div className="donut-chart-content">
            <Chart options={options_total_guest_list} series={series_total_guest_list} type="donut" />
            <div className='guest-count'>
              <p>{totalGuestLength}</p>
              <p>Guest</p>
            </div>
          </div>

        </div>
        <div className="guest-linear-chart" data-aos="zoom-out-down">
          <h5>RSVP Confirmed</h5>
          <p>{acceptedLength} out of {totalGuestLength}</p>
          <ReactApexChart options={options_invited_guest} series={series_invited_guest} type="bar" height={100} />

        </div>
        {/* <div className="guest-bar-chart">
          <h5>Checked In</h5>
          <div>
            <Chart options={options_guest_checked_in} series={series_guest_checked_in} type="bar" height={350} />
        </div>
        </div> */}
      </div>


    </section>
  )
}

export default TotalGuestPieChart
