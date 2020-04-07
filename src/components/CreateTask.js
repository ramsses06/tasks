import React from 'react';
import { string as yupString, object as yupObject } from 'yup';
import { Formik } from 'formik';
import { Button, Form, Col } from 'react-bootstrap';
import { IoMdAddCircle as AddIcon } from 'react-icons/io';

import utils from '../helpers/utils';
import { createTasks } from '../services/createTasks';

import CreateTaskModal from './CreateTaskModal';

class CreateTask extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalShow: false,
      customDuration: false
    };
    this.schema = yupObject({
      name: yupString().required(),
      description: yupString().required(),
      duration: yupString().required()
    });
  }

  /**
   *
   * @param {Object} objValues la tarea que se creara
   */
  async createTask (objValues) {
    const results = await createTasks({
      name: objValues.name,
      description: objValues.description,
      duration: objValues.duration,
      durationRemaining: objValues.duration,
      status: 'notstarted'
    });
    if (!results.error) {
      this.setState({ modalShow: false, customDuration: false });
      this.props.onCreatedTask(results.data); // Tasks.js -> addTask
    }
  }

  /**
   *
   * @param {Integer} minutes minutos
   * -> multiplico los minutos por la cantidas de 60 segundos
   */
  calcMinutesToRange (minutes) {
    return minutes * 60;
  }

  /**
   *
   * @param {integer} seconds segundos
   * representa segundos
   * desde 60 (1 minuto) hasta 7200 (2 horas)
   */
  formatToMinutesSeconds (seconds) {
    return utils().formatToMinutesSeconds(seconds);
  }

  render () {
    return (
      <>
        <Button variant='primary' onClick={() => this.setState({ ...this.state, modalShow: true })}>
          Crear Tarea <AddIcon style={{ color: 'white', fontSize: '25px' }} />
        </Button>

        <CreateTaskModal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false, customDuration: false })}
          title='Crear Tarea'
        >
          <Formik
            validationSchema={this.schema}
            onSubmit={this.createTask.bind(this)}
            initialValues={{
              name: '',
              description: '',
              duration: '1800'
            }}
          >
            {(props) => (
              <Form noValidate onSubmit={props.handleSubmit}>
                <Form.Row>
                  <Form.Group as={Col} controlId='validationFormik01'>
                    <Form.Control
                      type='text'
                      placeholder='Nombre'
                      name='name'
                      onChange={props.handleChange}
                      isInvalid={!!props.errors.name}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {props.errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId='validationFormik02'>
                    <Form.Control
                      type='text'
                      as='textarea'
                      placeholder='Descripcion'
                      name='description'
                      onChange={props.handleChange}
                      isInvalid={!!props.errors.description}
                    />
                    <Form.Control.Feedback type='invalid'>
                      {props.errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} xs={6}>
                    <Form.Label>Duracion</Form.Label>
                  </Form.Group>
                  <Form.Group as={Col} xs={6}>
                    <Form.Check
                      type='switch'
                      id='custom-switch'
                      label='Personalizado'
                      onChange={e => {
                        if (!e.target.checked) props.setFieldValue('duration', '1800');
                        this.setState({ ...this.state, customDuration: e.target.checked });
                      }}
                      checked={this.state.customDuration}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId='validationFormik03'>

                    {!this.state.customDuration && (
                      <Form.Control
                        as='select'
                        custom
                        name='duration'
                        selected={props.values.duration}
                        onChange={props.handleChange}
                      >
                        <option value={this.calcMinutesToRange(30)}>30 min</option>
                        <option value={this.calcMinutesToRange(45)}>45 min</option>
                        <option value={this.calcMinutesToRange(60)}>1 hr</option>
                      </Form.Control>
                    )}
                    {this.state.customDuration && (
                      <>
                        <Form.Label>{this.formatToMinutesSeconds(props.values.duration)}</Form.Label>
                        <Form.Control
                          type='range'
                          custom
                          name='duration'
                          min={60}
                          max={7200}
                          value={props.values.duration}
                          onChange={props.handleChange}
                        />
                      </>
                    )}
                  </Form.Group>
                </Form.Row>
                <Button variant='success' type='submit'>Crear</Button>
              </Form>
            )}
          </Formik>
        </CreateTaskModal>
      </>
    );
  }
}

export default CreateTask;
