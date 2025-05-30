import styles from './Todo.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux"
import Spinner from '../loading/Spinner';
import { RootState } from '../../redux/store';
import { TodoType, UserType } from '../../utils/types';
import { userAddTask, userEditTask, userDeleteTask, userToggleCompleted, fetchAllTodos, searchTodos } from '../../utils/taskApiCalls';

const Todo = () => {
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [todo, setTodo] = useState<string>('');
    const [desc, setDesc] = useState<string>('');

    const [todoEditing, setTodoEditing] = useState<string | null>(null);

    const [editingText, setEditingText] = useState<string>('');
    const [editingDesc, setEditingDesc] = useState<string>('');

    const [loading, setLoading] = useState<Boolean>(true);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<TodoType[]>([]);

    const user = useSelector((state: RootState) => state.user.user) as UserType | null;

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            try {
                const results = await searchTodos(searchQuery);
                setSearchResults(results);
                console.log("from component", results);
            } catch (error) {
                console.error(error);
            }
        };

        const timeout = setTimeout(() => {
            fetchSearchResults();
        }, 500)

        return () => clearTimeout(timeout);
    }, [searchQuery])
    
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const allTodos = await fetchAllTodos();

                setTodos(allTodos);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const newTodo = await userAddTask(todo, desc);

            setTodos([...todos, newTodo]);
            setTodo('');
            setDesc('');
        } catch (error) {
            console.error(error);
        }
    };

    const editTask = async (id: string) => {
        try {
            const updatedTodo = await userEditTask(id, editingText, editingDesc);
            
            const updatedTodos = todos.map((todo) =>
                todo._id === id
                    ? {
                          ...todo,
                          task: updatedTodo.task,
                          description: updatedTodo.description,
                          updatedAt: updatedTodo.updatedAt,
                      }
                    : todo
            );
            setTodos(updatedTodos);
            // reset
            setTodoEditing(null);
            setEditingText('');
            setEditingDesc('');
        } catch (error) {
            console.error(error);
        }
    };

    const cancelEditTask = () => {
        setTodoEditing(null);
        setEditingText('');
        setEditingDesc('');
    };

    const deleteTask = async (id: string) => {
        try {
            await userDeleteTask(id);
            
            const updatedTodos = [...todos].filter((todo) => todo._id !== id);
            setTodos(updatedTodos);

            // update also the filtered list
            if (searchQuery.trim()) {
                const updatedSearchResults = searchResults.filter((todo) => todo._id !== id);
                setSearchResults(updatedSearchResults);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleCompleted = async (id: string) => {
        try {
            const toggledTodo = await userToggleCompleted(id);

            const updatedTodos = todos.map((todo: any) =>
                todo._id === id ? { ...todo, isCompleted: toggledTodo.isCompleted } : todo
            );
            setTodos(updatedTodos);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <input
                type="text"
                placeholder='Search todos...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.filterInput}
            />
            <div className={styles.wrapper}>
                
                <h1 data-testid="app-title">Hello, {user?.name}</h1>
                <form className={styles.form} onSubmit={addTask}>
                    <div className={styles.inputColumn}>
                        <input
                            type="text"
                            placeholder="Task"
                            onChange={(e) => setTodo(e.target.value)}
                            value={todo}
                            className={styles.todoInput}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            onChange={(e) => setDesc(e.target.value)}
                            value={desc}
                            className={styles.descInput}
                        />
                    </div>
                    <button className={styles.submitButton} type="submit" aria-label="add task button">
                        Add Tasks
                    </button>
                </form>
                {loading ? (
                    <Spinner />
                ) : (
                    (searchQuery.trim() && searchResults.length > 0 
                    ? searchResults 
                    : todos).map((todo: TodoType) => (
                        <div className={styles.todoRow} key={todo._id}>
                            {todoEditing === todo._id ? (
                                <div className={styles.inputEditWrap}>
                                    <input
                                        className="input-edit-task"
                                        type="text"
                                        onChange={(e) => setEditingText(e.target.value)}
                                        value={editingText}
                                    />
                                    <input
                                        className="input-edit-desc"
                                        type="text"
                                        onChange={(e) => setEditingDesc(e.target.value)}
                                        value={editingDesc}
                                    />
                                </div>
                            ) : (
                                <div className={styles.inputShow}>
                                    <p className={styles.inputShowName}>{todo.task}</p>
                                    <p className={styles.inputShowDesc}>{todo.description}</p>
                                    <p className={styles.inputShowTime}>
                                        <span className={styles.spanTime}>
                                            Created at: {new Date(todo.createdAt).toLocaleString()}
                                        </span>
                                        <br />
                                        <span className={styles.spanTime}>
                                            Updated at: {new Date(todo.updatedAt).toLocaleString()}
                                        </span>
                                    </p>
                                </div>
                            )}
                            {/* 'todo' is changable */}
                            <div className={styles.buttons}>
                                {todoEditing === todo._id ? (
                                    <>
                                        <button
                                            data-testid={`submit-edit-btn-${todo._id}`}
                                            className={styles.submitEditBtn}
                                            aria-label="submit edit task button"
                                            onClick={() => editTask(todo._id)}
                                        >
                                            Submit Edit
                                        </button>
                                        <button className={styles.deleteBtn} onClick={() => cancelEditTask()}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            data-testid={`checkbox-${todo._id}`}
                                            type="checkbox"
                                            onChange={() => toggleCompleted(todo._id)}
                                            checked={todo.isCompleted}
                                            className={styles.checkbox}
                                        />
                                        <button
                                            data-testid={`edit-btn-${todo._id}`}
                                            className={styles.editBtn}
                                            aria-label="edit task button"
                                            onClick={() => {
                                                setTodoEditing(todo._id);
                                                setEditingText(todo.task);
                                                setEditingDesc(todo.description);
                                            }}
                                        >
                                            Edit Tasks
                                        </button>
                                        <button
                                            data-testid={`delete-btn-${todo._id}`}
                                            className={styles.deleteBtn}
                                            onClick={() => deleteTask(todo._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Todo;
