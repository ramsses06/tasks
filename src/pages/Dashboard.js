import React, { Component } from 'react';
import { Container, Jumbotron } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import './css/Dashboard.css';

class Dashboard extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Jumbotron fluid className='jumbotron-container'>
        <Container>
          <NavLink className='dash-navlink' to={{ pathname: '/tasks' }}>
            Tareas
          </NavLink>
          <NavLink className='dash-navlink' to={{ pathname: '/graphic' }}>
            Gráfica
          </NavLink>
        </Container>
      </Jumbotron>
    );
  }
}

export default Dashboard;
