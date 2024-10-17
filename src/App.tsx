/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';

import { getFilteredTodos } from './utils/getFilteredTodos';

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotifications';
import { TodoItemTemp } from './components/TodoItemTemp';

import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { FilterStatus } from './types/FilterStatus';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(Errors.DEFAULT);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.ALL);

  useEffect(() => {
    setErrorMessage(Errors.DEFAULT);
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LOADING_TODOS))
      .finally(() => setIsLoading(false));
  }, []);

  const handleResetErrorMessage = () => {
    setErrorMessage(Errors.DEFAULT);
  };

  const filteredTodos = getFilteredTodos(todos, filterStatus);

  const handleAddTodo = (
    { title, userId, completed }: Omit<Todo, 'id'>,
    setTitle: Dispatch<SetStateAction<string>>,
  ) => {
    setIsAddingTodo(true);
    const todo = {
      id: 0,
      title,
      userId,
      completed,
    };

    setTempTodo(todo);

    createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.ADDING_TODO);
        setTitle(title);
      })
      .finally(() => {
        setIsAddingTodo(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds(currentLoadingTodoIds => [
      ...currentLoadingTodoIds,
      todoId,
    ]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => setErrorMessage(Errors.DELETE_TODO))
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const handleUpdateTodo = (
    todoToUpdate: Todo,
    isEditing?: boolean,
    setIsEditing?: Dispatch<SetStateAction<boolean>>,
  ) => {
    setLoadingTodoIds(currentLoadingTodosIds => [
      ...currentLoadingTodosIds,
      todoToUpdate.id,
    ]);

    updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });

        if (isEditing) {
          setIsEditing!(false);
        }
      })
      .catch(() => setErrorMessage(Errors.UPDATE_TODO))
      .finally(() => setLoadingTodoIds([]));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setErrorMessage={setErrorMessage}
          handleAddTodo={handleAddTodo}
          isAddingTodo={isAddingTodo}
          errorMessage={errorMessage}
          handleUpdateTodo={handleUpdateTodo}
          isLoading={isLoading}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              handleDeleteTodo={handleDeleteTodo}
              todoToDelete={loadingTodoIds}
              handleUpdateTodo={handleUpdateTodo}
            />

            {tempTodo && (
              <TodoItemTemp tempTodo={tempTodo} isAddingTodo={isAddingTodo} />
            )}

            <Footer
              todos={todos}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              handleDeleteTodo={handleDeleteTodo}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        handleResetErrorMessage={handleResetErrorMessage}
      />
    </div>
  );
};
