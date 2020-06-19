import React from 'react';
import Charts from './Charts';
import { Container, Row, Col } from 'react-bootstrap';

function CountryData(props) {
  const chartData = props.stats;
  const selectedCountry = props.selectedCountry;
  const predictionsData = props.predictions;
  return (
    <Container fluid>
      <Row>
        <Col md={12} style={{ fontSize: 30, fontWeight: 'bold', padding: 20 }}>
          {selectedCountry}
        </Col>
      </Row>
      {/* <Today data={chartData} /> */}
      <div style={{ display: !selectedCountry && 'none' }}>
        <Charts
          chartData={chartData}
          selectedCountry={selectedCountry}
          predictionsData={predictionsData}
        />
      </div>
    </Container>
  );
}

export default CountryData;
