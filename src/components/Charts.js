import React from 'react';
import Chart from 'chart.js';
import { isEmpty } from 'lodash';
import { isMobile } from 'react-device-detect';

export default class Charts extends React.Component {
  chartRef = React.createRef();
  constructor() {
    super();
    this.myChart = {};
  }

  componentDidMount() {
    this.createChart(this.props);
  }

  componentDidUpdate() {
    this.createChart(this.props);
  }

  //   2020-1-22
  //   2020-7-16

  createChart(props) {
    if (props.chartData && props.chartData.length !== undefined) {
      var dates = [];
      var confirmed = [];
      var recovered = [];
      var deaths = [];
      var daily = [];
      var predictions = [];
      let temp = 0;
      //   console.log(dates)
      props.chartData.forEach(element => {
        dates.push(element.date);
        confirmed.push(element.confirmed);
        recovered.push(element.recovered);
        deaths.push(element.deaths);
        daily.push(element.confirmed - temp);
        temp = element.confirmed;
      });
      if (props.predictionsData && props.predictionsData.length !== undefined) {
        dates.length = 0;
        console.log('here');
        // console.log('dates :', dates);
        props.predictionsData.forEach(element => {
          dates.push(element.date);
        //   console.log('each date: ' , dates);
          predictions.push(element.forecast);
        });
        console.log('after : ', dates);
      }
      console.log(dates.length);
      let pointRadius = 3;
      let padding = 50;
      if (isMobile) {
        pointRadius = 1;
        padding = 5;
      }

      const myChartRef = this.chartRef.current.getContext('2d');
      if (!isEmpty(this.myChart)) {
        this.myChart.data.datasets[0].data = confirmed;
        this.myChart.data.datasets[1].data = recovered;
        this.myChart.data.datasets[2].data = deaths;
        this.myChart.data.datasets[3].data = daily;
        this.myChart.data.datasets[4].data = predictions;
        this.myChart.options.title.text = props.selectedCountry;
        this.myChart.update();
      } else {
        /*  if(isMobile){
                Chart.defaults.global.elements.point.borderWidth =0;
            } */
        this.myChart = new Chart(myChartRef, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [
              {
                label: 'Confirmed',
                data: confirmed,
                borderColor: '#4285f4',
                fill: false,
                pointRadius: pointRadius
              },
              {
                label: 'Recovered',
                data: recovered,
                borderColor: '#0c9d58',
                fill: false,
                pointRadius: pointRadius
              },
              {
                label: 'Deaths',
                data: deaths,
                borderColor: '#db4337',
                fill: false,
                pointRadius: pointRadius
              },
              {
                label: 'Daily',
                data: daily,
                borderColor: '#f4b400',
                fill: false,
                pointRadius: pointRadius
              },
              {
                label: 'Predictions',
                data: predictions,
                borderColor: '#E349DC',
                fill: false,
                pointRadius: pointRadius
              }
            ]
          },
          options: {
            animation: {
              duration: 1000,
              easing: 'easeInOutQuint'
            },
            layout: {
              padding: {
                left: padding,
                right: padding,
                top: padding,
                bottom: 10
              }
            },
            legend: {
              labels: {
                boxWidth: isMobile ? 10 : 40,
                padding: 10
              }
            },
            title: {
              display: false
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    maxTicksLimit: isMobile ? 4 : 10,
                    maxRotation: 0
                  }
                }
              ]
            }
          }
        });
      }
    }
  }

  render() {
    return (
      <div>
        <canvas id='myChart' ref={this.chartRef} />
      </div>
    );
  }
}
