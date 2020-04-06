import React from 'react';
import { Alert } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Task from './Task';

class TaskList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  reorder (list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  /**
   *
   * @param {Object} result resultado de la libreria para reordenar
   */
  onDragEnd (result) {
    if (!result.destination) {
      return;
    }
    const tasks = this.reorder(
      this.props.tasks,
      result.source.index,
      result.destination.index
    );
    this.props.onReorderedTasks(tasks, this.props.listName); // Tasks.js -> orderTasks
  }

  render () {
    if (!this.props.tasks.length) {
      return (
        <Alert variant='dark'>
          <Alert.Heading style={{ textAlign: 'center' }}>Sin tareas por el momento.</Alert.Heading>
        </Alert>
      );
    } else {
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {this.props.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Task
                          key={task.id}
                          task={task}
                          onDeletedTask={this.props.onDeletedTask}
                          onStartedTask={this.props.onStartedTask}
                          onFinishedTask={this.props.onFinishedTask}
                          removeFromTaskNotStarted={this.props.removeFromTaskNotStarted}
                          listName={this.props.listName}
                          filter={this.props.filter}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    }
  }
}

export default TaskList;
