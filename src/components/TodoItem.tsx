/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  ChangeEvent,
  useState,
  KeyboardEvent,
  FormEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  todoToDelete: number[];
  handleDeleteTodo: (todoId: number) => void;
  handleUpdateTodo: (
    todoToUpdate: Todo,
    setIsEditing?: Dispatch<SetStateAction<boolean>>,
  ) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  todoToDelete,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  const { id, completed, title } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleUpdateStatus = (event: ChangeEvent<HTMLInputElement>) => {
    handleUpdateTodo({
      ...todo,
      completed: event.target.checked,
    });
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value.trimStart());
  };

  const cancelEditing = () => {
    setNewTitle(title);
    setIsEditing(false);
  };

  const handleCancelEditingOnEsc = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      cancelEditing();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTitle.trim() === title) {
      cancelEditing();

      return;
    }

    if (!newTitle) {
      handleDeleteTodo(id);

      return;
    }

    handleUpdateTodo(
      {
        ...todo,
        title: newTitle.trim(),
      },
      setIsEditing,
    );
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
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

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleChangeTitle}
            onBlur={handleSubmit}
            autoFocus
            onKeyUp={handleCancelEditingOnEsc}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
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
        </>
      )}

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
