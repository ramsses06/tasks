import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryStack, VictoryContainer } from 'victory';

function GraphicDraw (props) {
  const completed = [
    { day: 1, qty: 0 },
    { day: 2, qty: 0 },
    { day: 3, qty: 0 },
    { day: 4, qty: 0 },
    { day: 5, qty: 0 }
  ];

  const total = [
    { day: 1, qty: 0 },
    { day: 2, qty: 0 },
    { day: 3, qty: 0 },
    { day: 4, qty: 0 },
    { day: 5, qty: 0 }
  ];

  let totalTasks = props.tasks.length;
  for (let task of props.tasks) {
    const day = new Date(task.finished_time).getDay() - 1; // para que mache con el arreglo
    completed[day].qty++;
  }
  for (let index = 0; index < total.length; index++) {
    totalTasks = totalTasks - completed[index].qty;
    total[index].qty = totalTasks;
  }

  return (
    <VictoryChart
      containerComponent={<VictoryContainer style={{ touchAction: 'auto' }} />}
      domainPadding={20}
      theme={VictoryTheme.material}
    >
      <VictoryAxis
        tickValues={[1, 2, 3, 4, 5]}
        tickFormat={['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={x => x}
      />
      <VictoryStack
        colorScale={['teal', 'lightcoral']}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 }
        }}
      >
        <VictoryBar
          data={completed}
          x='day'
          y='qty'
        />
        <VictoryBar
          data={total}
          x='day'
          y='qty'
        />
      </VictoryStack>
    </VictoryChart>
  );
}

export default GraphicDraw;
