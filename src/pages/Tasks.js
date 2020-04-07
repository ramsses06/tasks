import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Row, Col, ToggleButtonGroup, ToggleButton, Spinner, Jumbotron, Badge } from 'react-bootstrap';
import { IoMdArrowRoundBack as BackIcon } from 'react-icons/io';
import { getTasksQuery } from '../services/getTasksQuery';
import { getTasksFiltered } from '../services/getTasksFiltered';
import utils from '../helpers/utils';

import '../components/css/Tasks.css';

import TaskList from '../components/TaskList';
import CreateTask from '../components/CreateTask';
import RandomTasks from '../components/RandomTasks';

class Tasks extends Component {
  constructor (props) {
    super(props);
    this.state = {
      tasksNotStarted: [],
      tasksStarted: [],
      tasksFinished: [],
      filter: 1,
      loading: true
    };
    this.mountedComponent = false;
  }

  async componentDidMount () {
    // para no cambiar el estado si se desmonta el componente antes de terminar las peticiones
    this.mountedComponent = true;

    // request de las tareas
    const tasksNotStartedResults = await this.getTasksQueryAPI({ status: 'notstarted' });
    if (!tasksNotStartedResults.error && this.mountedComponent) {
      this.setState({
        ...this.state,
        tasksNotStarted: tasksNotStartedResults.data
      });
    }
    const tasksStartedResults = await this.getTasksQueryAPI({ status: ['started', 'paused'] });
    if (!tasksStartedResults.error && this.mountedComponent) {
      this.setState({
        ...this.state,
        tasksStarted: tasksStartedResults.data
      });
    }
    const tasksFinishedResults = await this.getTasksQueryAPI({ status: 'finished' });
    if (!tasksFinishedResults.error && this.mountedComponent) {
      this.setState({
        ...this.state,
        tasksFinished: tasksFinishedResults.data,
        loading: false
      });
    }
  }

  componentWillUnmount () {
    this.mountedComponent = false;
  }

  /**
   *
   * @param {Object} query { campo: valor }
   * Llamo a mi servicio enviando una query diferente
   */
  getTasksQueryAPI (query) {
    return getTasksQuery({
      where: query
    });
  }

  /**
   *
   * @param {Object} task objeto con datos de la tarea
   * -> este metodo se llama cuando se crea una tarea y se agrega al estado
   */
  addTask (task) {
    const validFilters = utils().getFilterId(task.duration);
    // verifico que el filtro activo haga match con los filtros validos para esta tarea para poder cambiar el estado con la nueva tarea creada
    if (validFilters.includes(this.state.filter)) {
      this.setState(prevState => ({
        ...this.state,
        tasksNotStarted: [task].concat(prevState.tasksNotStarted)
      }));
    }
  }

  /**
   *
   * @param {Array} tasks Objects
   * -> Arreglo con todas las tareas generadas por el script de crear 50 tareas aleatorias
   */
  addTasks (tasks) {
    this.setState({
      ...this.state,
      tasksFinished: tasks
    });
  }

  /**
   *
   * @param {integer} id de la tarea
   * @param {String} listName nombre del estado donde se encuentra la tarea
   *
   */
  removeTask (id, listName) {
    const tasks = this.state[listName];
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks.splice(taskIndex, 1);
    this.setState({
      ...this.state,
      [listName]: tasks
    });
  }

  /**
   *
   * @param {Object} task objeto de la tarea
   * @param {String} listName Nombre del estado donde se encuentra la tarea
   * @param {String} to nombre del estado a donde envio la tarea
   */
  moveTask (task, listName, to = 'tasksStarted') {
    const tasks = this.state[listName];
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    tasks.splice(taskIndex, 1);
    this.setState(prevState => ({
      ...this.state,
      [listName]: tasks,
      [to]: [task].concat(prevState[to])
    }));
  }

  /**
   *
   * @param {Integer} e numero del filtro
   * -> valido el tipo de filtro y traigo sus tareas
   */
  async filterTasks (e) {
    const [ thirtyMinutes, sixtyMinutes ] = [ 30 * 60, 60 * 60 ];
    const opts = { field: 'duration', query: { status: 'notstarted' } };

    if (e === 1) opts.range = [ 0, 7200 ];
    if (e === 2) opts.range = [ 0, thirtyMinutes ];
    if (e === 3) opts.range = [ thirtyMinutes, sixtyMinutes ];
    if (e === 4) opts.range = [ sixtyMinutes + 1, 7200 ];

    const tasksFilteredResults = await getTasksFiltered(opts);
    if (!tasksFilteredResults.error) {
      this.setState({
        ...this.state,
        tasksNotStarted: tasksFilteredResults.data,
        filter: e
      });
    }
  }

  /**
   *
   * @param {Integer} id id de la tarea
   * -> Remover una tarea del arreglo de tareas pendientes
   */
  removeFromTaskNotStarted (id) {
    const tasks = this.state.tasksNotStarted;
    const taskIndex = tasks.findIndex(t => t.id === id);
    tasks.splice(taskIndex, 1);
    this.setState({
      ...this.state,
      tasksNotStarted: tasks
    });
  }

  /**
   *
   * @param {Array} tasks Arreglo de tareas
   * @param {String} listName Nombre del estados de las tareas que ordeno
   * -> Cambia el arreglo de tareas por las nuevas ordenadas
   */
  orderTasks (tasks, listName) {
    this.setState({
      ...this.state,
      [listName]: tasks
    });
  }

  render () {
    if (this.state.loading) {
      return (
        <Jumbotron fluid style={{ height: '100vh', padding: 0, margin: 0 }}>
          <Container fluid style={{ height: '100%' }}>
            <Row>
              <Col style={{ backgroundColor: '#333' }}>
                <NavLink to={{ pathname: '/' }}>
                  <BackIcon style={{ color: 'white', fontSize: '30px', margin: '7px' }} />
                </NavLink>
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
              <Spinner style={{ height: '10rem', width: '10rem' }} animation='grow' variant='info' />
            </Row>
          </Container>
        </Jumbotron>
      );
    }

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
          <Row style={{ background: '#252525', marginBottom: '25px' }}>
            <Col sm={4} className='verticalPadding center-text'>
              <CreateTask onCreatedTask={this.addTask.bind(this)} />
            </Col>
            <Col sm={8} className='verticalPadding center-text'>
              <RandomTasks onCreatedTasks={this.addTasks.bind(this)} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col xs='12' className='verticalPaddingSmall'>
                  <h3>
                    <Badge variant='info'>En progreso {'  '}<Badge variant='light'>{this.state.tasksStarted.length}</Badge></Badge>
                  </h3>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <TaskList
                    listName='tasksStarted'
                    tasks={this.state.tasksStarted}
                    onDeletedTask={this.removeTask.bind(this)}
                    onStartedTask={this.moveTask.bind(this)}
                    onFinishedTask={this.moveTask.bind(this)}
                    onReorderedTasks={this.orderTasks.bind(this)}
                  />
                </Col>
              </Row>

              <Row>
                <br />
              </Row>

              <Row>
                <Col sm={5} className='verticalPaddingSmall'>
                  <h3>
                    <Badge variant='info'>Pendientes {'  '}<Badge variant='light'>{this.state.tasksNotStarted.length}</Badge></Badge>
                  </h3>
                </Col>
                <Col sm={7}>
                  <ToggleButtonGroup sm={7} onChange={this.filterTasks.bind(this)} type='radio' name='options' defaultValue={1}>
                    <ToggleButton variant='outline-secondary' value={1}>Todas</ToggleButton>
                    <ToggleButton variant='outline-secondary' value={2}>Cortas</ToggleButton>
                    <ToggleButton variant='outline-secondary' value={3}>Medias</ToggleButton>
                    <ToggleButton variant='outline-secondary' value={4}>Largas</ToggleButton>
                  </ToggleButtonGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TaskList
                    listName='tasksNotStarted'
                    tasks={this.state.tasksNotStarted}
                    onDeletedTask={this.removeTask.bind(this)}
                    onStartedTask={this.moveTask.bind(this)}
                    filter={this.state.filter}
                    onFilteredTasks={this.filterTasks.bind(this)}
                    removeFromTaskNotStarted={this.removeFromTaskNotStarted.bind(this)}
                    onReorderedTasks={this.orderTasks.bind(this)}
                  />
                </Col>
              </Row>

              <Row>
                <br />
              </Row>

              <Row>
                <Col className='verticalPaddingSmall'>
                  <h3>
                    <Badge variant='info'>Completadas {'  '}<Badge variant='light'>{this.state.tasksFinished.length}</Badge></Badge>
                  </h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TaskList
                    listName='tasksFinished'
                    tasks={this.state.tasksFinished}
                    onDeletedTask={this.removeTask.bind(this)}
                    onStartedTask={this.moveTask.bind(this)}
                    onReorderedTasks={this.orderTasks.bind(this)}
                  />
                </Col>
              </Row>

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Tasks;
