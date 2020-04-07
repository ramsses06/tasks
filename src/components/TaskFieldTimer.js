import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPlay as PlayIcon, FaPause as PauseIcon } from 'react-icons/fa';
import { MdRefresh as RefreshIcon } from 'react-icons/md';

import { updateTasks } from '../services/updateTasks';
import utils from '../helpers/utils';

function TaskFieldTimer (props) {
  const [seconds, setSeconds] = useState(props.task.durationRemaining);
  const [isRunning, setIsRunning] = useState(props.task.status === 'started');

  /**
   * pauso o iniciop el temporizador
   */
  function pauseStart () {
    props.editTask({
      id: props.task.id,
      status: isRunning ? 'paused' : 'started',
      durationRemaining: seconds
    });
    setIsRunning(!isRunning);
  }

  /**
   * reinicio el temporizador
   */
  function reset () {
    setSeconds(props.task.duration);
    setIsRunning(false);
    props.editTask({
      id: props.task.id,
      status: 'paused',
      durationRemaining: props.task.duration
    });
  }

  /**
   * 
   * @param {Object} e evento de ventana
   * -> antes de salir de la ventna, pauso la tarea
   */
  function outFromWindow (e) {
    e.preventDefault();
    window.removeEventListener('beforeunload', outFromWindow);
    if (isRunning) {
      updateTasks({
        id: props.task.id,
        status: seconds ? 'paused' : 'finished',
        durationRemaining: seconds
      });
    }
    return true;
  }

  /**
   * hook para temporizador
   */
  useEffect(() => {
    let interval = null;
    if (seconds === 0) { // si llega a 0 detenemos el intervalo y actualizamos
      clearInterval(interval);
      finalizeTask();
    }
    if (isRunning) { // si esta en corriendo vamos quitando segundos
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    }
    if (!isRunning && seconds !== 0) { // si se pausa para detener el intervalo
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRunning, seconds]);

  /**
   * hook para escuchar cuando se sale de la ventana
   */
  useEffect(() => {
    window[`${props.task.id}_${props.task.name}_seconds`] = seconds;
    window[`${props.task.id}_${props.task.name}_isRunning`] = isRunning;
    window.addEventListener('beforeunload', outFromWindow);
    return () => {
      return window.removeEventListener('beforeunload', outFromWindow);
    };
  }, [isRunning, seconds]);

  /**
   * hook para pausar la tarea si se desmonta el componente
   */
  useEffect(function () {
    return () => {
      const isRunning = window[`${props.task.id}_${props.task.name}_isRunning`];
      const seconds = window[`${props.task.id}_${props.task.name}_seconds`];
      if (isRunning) {
        updateTasks({
          id: props.task.id,
          status: seconds ? 'paused' : 'finished',
          durationRemaining: seconds
        });
      }
      return true;
    };
  }, []);

  /**
   * Finaliza la tarea
   */
  async function finalizeTask () {
    window.removeEventListener('beforeunload', outFromWindow);
    const updated = await updateTasks({ id: props.task.id, status: 'finished', durationRemaining: seconds });
    if (!updated.error) {
      const newTask = props.task;
      newTask.status = 'finished';
      newTask.durationRemaining = seconds;
      props.onFinishedTask(newTask, props.listName, 'tasksFinished'); // Tasks.js -> moveTask
    }
  }

  return (
    <>
      {!!seconds && (
        <>
          <Button onClick={pauseStart} variant='dark' style={{ marginRight: '5px' }}>
            {isRunning && (
              <PauseIcon style={{ color: 'white', fontSize: '10px' }} />
            )}
            {!isRunning && (
              <PlayIcon style={{ color: 'white', fontSize: '10px' }} />
            )}
          </Button>
          <Button onClick={reset} variant='light' style={{ marginRight: '5px', padding: '3px' }} >
            <RefreshIcon style={{ color: 'black', fontSize: '30px' }} />
          </Button>
          <Button variant='success' onClick={finalizeTask}>
            Finalizar
          </Button>
        </>
      )}
      <Card.Text>
        {!!seconds && (
          <small className='text-muted'>tiempo restante: {utils().formatToMinutesSeconds(seconds)}</small>
        )}
        {!seconds && (
          <small className='text-muted'>completada</small>
        )}
      </Card.Text>
    </>
  );
}

export default TaskFieldTimer;
