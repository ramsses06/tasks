import React, { useState } from 'react';
import { Card, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { MdModeEdit as EditIcon } from 'react-icons/md';
import { FaCheck as AcceptIcon } from 'react-icons/fa';
import { IoMdClose as CancelIcon } from 'react-icons/io';

// Layout para editar descripcion.
function TaskFieldDescriptionLayout (props) {
  return (
    <div className='task-description-container'>
      {!props.isEditing && (
        <Button onClick={props.onEdit} className='task-description-button' variant='primary'>
          <EditIcon style={{ color: 'white' }} />
        </Button>
      )}
      {props.children}
    </div>
  );
}

function TaskFieldDescription (props) {
  const [state, setState] = useState({
    edition: false
  });

  /**
   * Marco este campo como editando
   */
  const onEdit = () => {
    setState({ ...state, edition: true });
  };

  /**
   *
   * @param {Object} event handle del evento del boton
   * -> edito la descripcion de la tarea
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setState({
      ...state,
      edition: false
    });
    props.editTask({ description: event.target.elements.description.value }); // Task.js editTask
  };

  /**
   * Cancelar la edicion del campo descripcion
   */
  const cancel = () => {
    setState({
      ...state,
      edition: false
    });
  };

  return (
    <TaskFieldDescriptionLayout onEdit={onEdit} isEditing={state.edition}>
      {state.edition && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='description'>
            <InputGroup>
              <FormControl
                type='text'
                defaultValue={props.text}
                as='textarea'
              />
              <InputGroup.Append>
                <Button variant='success' type='submit'>
                  <AcceptIcon style={{ color: 'white' }} />
                </Button>
                <Button variant='danger' onClick={cancel}>
                  <CancelIcon style={{ color: 'white' }} />
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Form>
      )}
      {!state.edition && (
        <Card.Text>{props.text}</Card.Text>
      )}
    </TaskFieldDescriptionLayout>
  );
}

export default TaskFieldDescription;
