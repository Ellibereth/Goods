var React = require('react');
var ReactDOM = require('react-dom');
import {Grid, Row, Col} from 'react-bootstrap';
import TopNavBar from '../Navbar/TopNavBar.js'
import HomePageLeft from './HomePageLeft.js'
import HomePageRight from './HomePageRight.js'

export default class HomePageMainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {

    return (
             <Grid>
                <Row className="show-grid">
                    <Col xs = {6} xsPush ={6} md={6} mdPush={6}>
                      <HomePageRight />
                    </Col>
                    <Col xs = {6} xsPull = {6} md={6} mdPull={6}>
                      <HomePageLeft toggleRequestFormModal = {this.props.toggleRequestFormModal.bind(this)}/>
                    </Col>  
                  </Row>
              </Grid>
    );
  }
}