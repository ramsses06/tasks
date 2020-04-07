import React from 'react';
import { Button } from 'react-bootstrap';
import { IoMdAddCircle as AddIcon } from 'react-icons/io';
import { loremIpsum } from 'react-lorem-ipsum';

import { createManyTasks } from '../services/createManyTasks';

function RandomTasks (props) {
  /**
   *
   * @param {Integer} from numero entero
   * @param {Integer} to numero entero
   * -> genero un numero aleatorio entre este rango
   */
  const randomNumber = (from, to) => {
    const min = from;
    const max = to;
    const random = Math.floor(Math.random() * (max - min)) + min;
    return random;
  };

  /**
   * Genero 50 tareas aleatorias
   */
  const createRandomTasks = async () => {
    const tasksToCreate = [];
    for (let x = 50; x > 0; x--) {
      const status = 'finished';
      // uso una libreria para generar un texto y una descripcion
      const name = loremIpsum({ p: 1, startWithLoremIpsum: false, avgWordsPerSentence: 1, avgSentencesPerParagraph: 1 })[0];
      const description = loremIpsum({ p: 1, startWithLoremIpsum: false, avgWordsPerSentence: 5, avgSentencesPerParagraph: 1 })[0];
      // numero random entre 15 min y 2 hr (en segundos)
      const duration = randomNumber(900, 7200);
      // tiempo que quedo de la duracion total ( aleatorio 0% a 20% )
      const durationRemaining = Math.floor(duration * (randomNumber(0, 20) / 100));

      // Semana [0, 1, 2, 3, 4, 5, 6] -> [Do, Lu, Ma, Mi, Ju, Vi, Sa]
      const today = new Date();
      // calculo cuantos dias hay de hoy al viernes de la ultima semana
      const days = new Date().getDay() + 2 > 7 ? 1 : new Date().getDay() + 2;
      const randomDay = randomNumber(0, 5);
      // dia de hoy - dias para el ultimo viernes - dias aleatorios
      const finishedTime = new Date(today - (1000 * 60 * 60 * 24 * (days + randomDay)));
      // a que hora inicio la tarea
      const startedTime = new Date(finishedTime - ((duration - durationRemaining) * 1000));

      tasksToCreate.push({
        name,
        description,
        status,
        duration,
        durationRemaining,
        finished_time: finishedTime,
        started_time: startedTime
      });
    }
    const results = await createManyTasks(tasksToCreate);
    if (!results.error) {
      props.onCreatedTasks(results.data); // Tasks.js addTasks
    }
  };

  return (
    <Button variant='primary' onClick={createRandomTasks}>
      Crear 50 tareas aleatorias <AddIcon style={{ color: 'white', fontSize: '25px' }} />
    </Button>
  );
}

export default RandomTasks;
