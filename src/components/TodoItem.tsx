/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, ChangeEvent } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  todoToDelete: number[];
  handleDeleteTodo: (todoId: number) => void;
  handleUpdateTodo: (todoToUpdate: Todo) => void;
};
export const TodoItem: FC<Props> = ({
  todo,
  todoToDelete,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  const { id, completed, title } = todo;

  const handleUpdateStatus = (event: ChangeEvent<HTMLInputElement>) => {
    handleUpdateTodo({
      ...todo,
      completed: event.target.checked,
    });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleUpdateStatus}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todoToDelete.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
