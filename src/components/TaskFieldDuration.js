import React, { useState } from 'react';
import { Card, Button, Form, Col } from 'react-bootstrap';
import { MdModeEdit as EditIcon } from 'react-icons/md';

import CreateTaskModal from './CreateTaskModal';
import { updateTasks } from '../services/updateTasks';

import utils from '../helpers/utils';

// layout para editar la duracion de la tarea
function TaskFieldDurationLayout (props) {
  const canEdit = props.status === 'notstarted';
  return (
    <div className='task-duration-container'>
      {(!props.isEditing && canEdit) && (
        <Button onClick={props.onEdit} className='task-duration-button' variant='primary'>
          <EditIcon style={{ color: 'white' }} />
        </Button>
      )}
      {props.children}
    </div>
  );
}

function TaskFieldDuration (props) {
  const [state, setState] = useState({
    modalShow: false,
    customDuration: [1800, 2700, 3600].includes(parseInt(props.task.duration)),
    duration: props.task.duration
  });

  /**
   * Mostrar modal de edicion
   */
  const onEdit = () => {
    setState({ ...state, modalShow: true });
  };

  /**
   *
   * @param {Object} event objeto del evento con datos del formulario de edicion
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setState({
      ...state,
      modalShow: false
    });
    const { value } = event.target.elements.duration;
    const { durationRemaining } = props.task;
    // si la nueva duracion es menor al tiempo que le quedaba lo cambio
    if (props.listName === 'tasksNotStarted') {
      const [ thirtyMinutes, sixtyMinutes ] = [ 30 * 60, 60 * 60 ];
      let isInvalidForFilter = false;
      // si la duracion no entra en el rango del filtro la quitaremos
      if (props.filter === 2) {
        if (value > thirtyMinutes) isInvalidForFilter = true;
      }
      if (props.filter === 3) {
        if (value < thirtyMinutes || value > sixtyMinutes) isInvalidForFilter = true;
      }
      if (props.filter === 4) {
        if (value < sixtyMinutes) isInvalidForFilter = true;
      }
      if (isInvalidForFilter) {
        // llamo directo la mi servicio de actualizacion
        updateTasks({
          id: props.task.id,
          durationRemaining: value <= durationRemaining ? value : durationRemaining,
          duration: value
        });
        props.removeFromTaskNotStarted(props.task.id); // Tasks.js -> removeFromTaskNotStarted
      } else {
        // Task.js -> editTask
        props.editTask({
          durationRemaining: value <= durationRemaining ? value : durationRemaining,
          duration: value
        });
      }
    } else {
      // Task.js -> editTask
      props.editTask({
        durationRemaining: value <= durationRemaining ? value : durationRemaining,
        duration: value
      });
    }
  };

  return (
    <TaskFieldDurationLayout onEdit={onEdit} isEditing={state.modalShow} status={props.task.status}>
      {state.modalShow && (
        <CreateTaskModal
          show={state.modalShow}
          onHide={() => setState({
            modalShow: false,
            customDuration: [1800, 2700, 3600].includes(parseInt(props.task.duration)),
            duration: props.task.duration
          })}
          title={props.task.name}
        >
          <Form onSubmit={handleSubmit}>
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
                    setState({
                      ...state,
                      customDuration: e.target.checked,
                      duration: !e.target.checked ? 1800 : state.duration
                    });
                  }}
                  checked={state.customDuration}
                />
              </Form.Group>
              <Form.Group as={Col}>
                {!state.customDuration && (
                  <Form.Control
                    as='select'
                    custom
                    name='duration'
                    value={String(state.duration)}
                    onChange={e => setState({ ...state, duration: e.target.value })}
                  >
                    <option value={30 * 60}>30 min</option>
                    <option value={45 * 60}>45 min</option>
                    <option value={60 * 60}>1 hr</option>
                  </Form.Control>
                )}
                {state.customDuration && (
                  <>
                    <Form.Label>{utils().formatToMinutesSeconds(state.duration)}</Form.Label>
                    <Form.Control
                      type='range'
                      custom
                      name='duration'
                      min={60}
                      max={7200}
                      value={state.duration}
                      onChange={e => setState({ ...state, duration: e.target.value })}
                    />
                  </>
                )}
              </Form.Group>
            </Form.Row>
            <Button variant='success' type='submit'>
              Cambiar Duración
            </Button>
          </Form>
        </CreateTaskModal>
      )}
      {!state.modalShow && (
        <Card.Text>
          <small className='text-muted'>Duracion: {utils().formatToMinutesSeconds(props.task.duration)}</small>{' '}
          {props.listName === 'tasksFinished' && (
            <>
              <span style={{ marginLeft: 15 }} />
              <small className='text-muted'>Finalizo en: {utils().formatToMinutesSeconds(props.task.duration - props.task.durationRemaining)}</small>{' '}
            </>
          )}
        </Card.Text>
      )}
    </TaskFieldDurationLayout>
  );
}

export default TaskFieldDuration;
