import React from 'react';
import CountryData from './CountryData';
import { Container, Row, Col, Button } from 'react-bootstrap';
import SelectBox from './SelectBox';

export default class CovidData extends React.Component {
  constructor() {
    super();
    this.state = {
      countryArr: [],
      data: {},
      worldStats: {},
      selectedCounty: '',
      predictions: []
    };
    this.getData = this.getData.bind(this);
    this.backToGlobalNumbers = this.backToGlobalNumbers.bind(this);
    fetch('https://pomber.github.io/covid19/timeseries.json')
      .then(response => response.json())
      .then(data => {
        var worldStats = { confirmed: 0, recovered: 0, deaths: 0 };
        var countryArr = Object.keys(data).map(i => i);
        countryArr.forEach(country => {
          let countryData = data[country];
          // pick last object for today data
          countryData = countryData[countryData.length - 1];
          worldStats.confirmed += countryData.confirmed;
          worldStats.recovered += countryData.recovered;
          worldStats.deaths += countryData.deaths;
        });
        // world data
        var worldChart = [];
        countryArr.forEach(country => {
          let countryData = data[country];
          countryData.forEach((dailyData, index) => {
            if (worldChart[index] === undefined) {
              var worldStats = {
                date: dailyData.date,
                confirmed: dailyData.confirmed,
                recovered: dailyData.recovered,
                deaths: dailyData.deaths
              };
              worldChart.push(worldStats);
            } else {
              worldChart[index].confirmed += dailyData.confirmed;
              worldChart[index].recovered += dailyData.recovered;
              worldChart[index].deaths += dailyData.deaths;
            }
          });
        });
        console.log(data);
        this.setState({
          countryArr: countryArr,
          data: data,
          worldStats: worldStats,
          worldChart: worldChart
        });
      });
  }

  getData(event) {
    var country = event.target.value;
    if (country !== 'select') {
      this.setState({
        selectedCountry: country
      });
    } else {
      this.setState({
        selectedCountry: ''
      });
    }
  }

  backToGlobalNumbers() {
    this.setState({
      selectedCountry: ''
    });
  }
  render() {
    const countryStats = this.state.data[this.state.selectedCountry];
    const countryPredictions = this.state.predictions;
    const worldChart = this.state.worldChart;
    const lastUpdated =
      worldChart !== undefined ? worldChart[worldChart.length - 1].date : '';
    
    return (
      <Container
        fluid
        style={{ backgroundColor: '#f8f8ff', padding: 0 }}
        className='App'
      >
        {/*Header starts here */}
        <Row className='App-header'>
          <Col md={12} className='App-title'>
            Covid Predictor
          </Col>
          {/*Select Box for country search ends here */}
        </Row>
        {/*Header ends here */}
        <Row>
          <Col md={{ span: 6 }}>
            <SelectBox
              onChangeFunction={this.getData}
              countryArr={this.state.countryArr}
              selectedValue={this.state.selectedCountry}
            />
          </Col>
          <Col md={{ span: 4 }} style={{ fontSize: 14, marginTop: 12 }}>
            Last Updated: {lastUpdated}
          </Col>
        </Row>
        <Container fluid>
          {this.state.selectedCountry ? (
            <CountryData
              stats={countryStats}
              selectedCountry={this.state.selectedCountry}
            />
          ) : (
            <CountryData stats={worldChart} selectedCountry='Global' />
          )}
        </Container>
      </Container>
    );
  }
}
