import React from 'react';
import { Card, Button, Col, Row } from 'react-bootstrap';
import { MdDelete as DeleteIcon } from 'react-icons/md';

import { updateTasks } from '../services/updateTasks';
import { deleteTask } from '../services/deleteTask';

import TaskFieldDescription from './TaskFieldDescription';
import TaskFieldTimer from './TaskFieldTimer';
import TaskFieldDuration from './TaskFieldDuration';

class Task extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      task: this.props.task || null
    };
  }

  /**
   *
   * @param {Object} objUpdate tarea a actualizar
   */
  async editTask (objUpdate) {
    const updated = await updateTasks({ id: this.state.task.id, ...objUpdate });
    if (!updated.error) {
      this.setState({
        ...this.state,
        task: {
          ...this.state.task,
          ...objUpdate
        }
      });
    }
  }

  /**
   * Borrar tarea
   */
  async deleteTask () {
    const deleted = await deleteTask([this.state.task.id]);
    if (!deleted.error) {
      this.props.onDeletedTask(this.state.task.id, this.props.listName); // Tasks.js -> removeTask
    }
  }

  /**
   * Actualizar tarea a inicada
   */
  async startTask () {
    const updated = await updateTasks({ id: this.state.task.id, status: 'started' });
    if (!updated.error) {
      const newTask = this.state.task;
      newTask.status = 'started';
      this.props.onStartedTask(newTask, this.props.listName); // Tasks.js -> moveTask
    }
  }

  render () {
    const { task } = this.state;
    const borderVariant = task.status === 'started' ? 'success'
      : task.status === 'paused' ? 'danger'
        : task.status === 'notstarted' ? 'warning'
          : 'secondary';
    return (
      <div>
        <Card border={borderVariant}>
          <Card.Header style={{ padding: '5px' }} className='task-card-header'>
            <Card.Title style={{ padding: 0, margin: 0 }}>{task.name}</Card.Title>
            <Button onClick={this.deleteTask.bind(this)} className='task-delete-button' variant='danger'>
              <DeleteIcon style={{ color: 'white' }} />
            </Button>
          </Card.Header>
          <Card.Body style={{ padding: '5px' }}>
            <TaskFieldDescription text={task.description} editTask={this.editTask.bind(this)} />
            <Row>
              <Col sm={6}>
                <TaskFieldDuration
                  task={task}
                  editTask={this.editTask.bind(this)}
                  listName={this.props.listName}
                  filter={this.props.filter}
                  removeFromTaskNotStarted={this.props.removeFromTaskNotStarted}
                />
              </Col>
              <Col sm={6} className='right-text'>
                {(task.status !== 'notstarted' && task.status !== 'finished') && (
                  <TaskFieldTimer
                    task={task}
                    editTask={this.editTask.bind(this)}
                    onFinishedTask={this.props.onFinishedTask}
                    listName={this.props.listName}
                  />
                )}
                {task.status === 'notstarted' && (
                  <Button variant='success' onClick={() => this.startTask('status', 'started')}>
                    Iniciar Tarea
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <br />
      </div>
    );
  }
}

export default Task;
