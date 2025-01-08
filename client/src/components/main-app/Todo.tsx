import styles from './Todo.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux"
import axios from 'axios';
import { baseUrl } from '../../utils/baseUrl';
import Spinner from '../loading/Spinner';
import { RootState } from '../../redux/store';

const Todo = () => {
    const [todos, setTodos] = useState<any>([]);
    const [todo, setTodo] = useState('');
    const [desc, setDesc] = useState('');

    const [todoEditing, setTodoEditing] = useState(null);

    const [editingText, setEditingText] = useState('');
    const [editingDesc, setEditingDesc] = useState('');

    const [loading, setLoading] = useState(true);

    const user: any = useSelector((state: RootState) => state.user.user);
    
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await axios.get(`${baseUrl}/get`, {
                    withCredentials: true
                });
                setTodos(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    const addTask = async (e: any) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${baseUrl}/save`, {
                task: todo, description: desc
            }, {
                withCredentials: true
            });

            setTodos([...todos, res.data.newTodo]);
            setTodo('');
            setDesc('');
        } catch (error) {
            console.error(error);
        }
    };

    const editTask = async (id: string) => {
        try {
            const res = await axios.put(`${baseUrl}/update/${id}`, {
                task: editingText, description: editingDesc
            }, {
                withCredentials: true
            });
            const updatedTodos = todos.map((todo: any) =>
                todo._id === id
                    ? {
                          ...todo,
                          task: res.data.updatedTodo.task,
                          description: res.data.updatedTodo.description,
                          updatedAt: res.data.updatedTodo.updatedAt,
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
            await axios.delete(`${baseUrl}/delete/${id}`, {
                withCredentials: true
            });
            const updatedTodos = [...todos].filter((todo) => todo._id !== id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleCompleted = async (id: string) => {
        try {
            const res = await axios.put(`${baseUrl}/toggle/${id}`, {}, {
                withCredentials: true
            });
            const updatedTodos = todos.map((todo: any) =>
                todo._id === id ? { ...todo, isCompleted: res.data.updatedTodo.isCompleted } : todo
            );
            setTodos(updatedTodos);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 data-testid="app-title">Hello, {user.name}</h1>
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
                todos.map((todo: any) => (
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
    );
};

export default Todo;
