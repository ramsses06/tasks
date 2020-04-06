import React, { Component } from 'react';
import { Container, Badge, Row, Col } from 'react-bootstrap';
import { IoMdArrowRoundBack as BackIcon } from 'react-icons/io';
import { NavLink } from 'react-router-dom';

import { getTasksFiltered } from '../services/getTasksFiltered';

import GraphicDraw from '../components/GraphicDraw';
import './css/Dashboard.css';

class Dashboard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      tasks: []
    };

    this.mountedComponent = false;
  }

  async componentDidMount () {
    this.mountedComponent = true;

    const lastWeekDates = this.lastWeekDates();

    const tasksFilteredResults = await getTasksFiltered({
      field: 'finished_time',
      range: [ lastWeekDates.startDate, lastWeekDates.endDate ],
      query: {}
    });
    if (!tasksFilteredResults.error) {
      this.setState({
        ...this.state,
        tasks: tasksFilteredResults.data,
      });
    }
  }

  lastWeekDates () {
    // fecha actual
    const today = new Date();
    // dia de la semana extraida del objeto Date [Domingo(0) - lunes(6)]
    const day = new Date().getDay() + 2;
    // calculo cuantos dias quitarle a esta semana
    const days = day > 7 ? 1 : day;
    // calculo el viernes de la semana anterior
    const oneDayTime = 1000 * 60 * 60 * 24;
    const twelveHours = 1000 * 60 * 60 * 12;
    // le sumo 6 hora para comparar en la base de datos con UTC
    const endDate = new Date( today - ((oneDayTime - twelveHours) * (days)) );
    // calculu su lunes
    const startDate = new Date( endDate - ((oneDayTime + twelveHours) * 4) );

    return { startDate, endDate };
  }

  componentWillUnmount () {
    this.mountedComponent = false;
  }

  render () {
    return (
      <div>
        <Container fluid>
          <Row>
            <Col style={{ backgroundColor: '#333' }}>
              <NavLink to={{ pathname: '/' }}>
                <BackIcon style={{ color: 'white', fontSize: '30px', margin: '7px' }} />
              </NavLink>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <h2 style={{ textAlign: 'center', padding: '3px' }}>Tareas de la ultima semana</h2>
            </Col>
            <Col xs={12} style={{ textAlign: 'center', padding: '3px' }}>
              <Badge style={{ backgroundColor: 'teal', color: 'white', margin: '3px 0' }}>
                <h6 style={{ textAlign: 'center', padding: '5px', margin: '0' }}>Tareas completadas</h6>
              </Badge>{' '}
              <Badge style={{ backgroundColor: 'lightcoral', color: 'white', margin: '3px 0' }}>
                <h6 style={{ textAlign: 'center', padding: '5px', margin: 0 }}>Total de tareas completadas restantes</h6>
              </Badge>{' '}
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 10, offset: 1 }} sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
              {this.state.tasks.length > 0 && (
                <GraphicDraw tasks={this.state.tasks} />
              )}
              {this.state.tasks.length < 1 && (
                <h2 style={{ textAlign: 'center', padding: '3px' }}>No hay tareas terminadas en la ultima semana</h2>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
