import { useEffect, useState } from "react"
import { supabase } from "../supabase/supabaseClient"
import type { StatusTaskInterface, TaskInterface } from "../interface";
import './style/task.css'
import Loader from "../component/Loader";

const Task = () => {
    const user_id = localStorage.getItem('user_id');
    // const [user, setUser] = useState<any>(null);
    const [task, setTask] = useState<TaskInterface[]>([]);
    const [popup, setPopup] = useState(false);
    const [statusTask, setStatusTask] = useState<StatusTaskInterface[]>([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [taskForm, setTaskForm] = useState<TaskInterface>({
        task_name: '',
        task_description: '',
        start_date: new Date(),
        end_date: new Date(),
        user_id: String(user_id),
        status_id: ''
    });

    useEffect(() => {
        if (user_id) {
            getTask();
            getStatusTask();
        }
    }, [user_id]);


    const getTask = async () => {
        if (!user_id) {
            console.error('User not found');
            return;
        }
        try {
            const { data, error, status } = await supabase
                .from('task')
                .select(`*,status_task (
                    status_name
                )`)
                .eq('user_id', user_id);

            if (error && status !== 406) {
                throw error;
            }
            if (data) {
                // console.table(data);
                setLoading(false);
                setTask(data);
            } else {
                setTask([]);
                setLoading(false);
            }
        } catch (error: any) {
            alert(error.message);
            setUploading(false);
            console.error('Error fetching task:', error.message);
        }
    };

    const InsertTask = async (event: any) => {
        event.preventDefault();
        if (!taskForm.status_id) {
            alert("กรุณาเลือกสถานะ");
            return;
        }
        try {
            setUploading(true);
            // console.table(taskForm);
            const { error } = await supabase
                .from('task')
                .insert(taskForm);
            if (error) {
                throw error;
            } else {
                setUploading(false);
            }
            await getTask();
        } catch (error: any) {
            alert(error.message);
            setUploading(false);
            console.error('Error inserting task:', error.message);
        }
    }

    const UpdateTask = async (id: string, statusID: string) => {
        if (!id || !statusID) {
            console.error('Error updating task: id is null or undefined');
            return;
        }
        try {
            setUploading(true);
            const { error } = await supabase
                .from('task')
                .update({ status_id: statusID })
                .eq('id', id);
            if (error) {
                throw error;
            } else {
                setUploading(false);
            }
            await getTask();
        } catch (error: any) {
            alert(error.message);
            setUploading(false);
            console.error('Error updating task:', error.message);
        }
    }


    const DeleteTask = async (id: string) => {
        if (!id) {
            console.error('Error deleting task: id is null or undefined');
            return;
        }
        try {
            setUploading(true);
            const { error } = await supabase
                .from('task')
                .delete()
                .eq('id', id);
            if (error) {
                throw error;
            } else {
                setUploading(false);
            }
            await getTask();
        } catch (error: any) {
            alert(error.message);
            setUploading(false);
            console.error('Error deleting task:', error.message);
        }
    }

    // --------------------- get status task ---------------------
    const getStatusTask = async () => {
        try {
            const { data: status_task, error } = await supabase
                .from('status_task')
                .select('*')
            if (error) {
                throw error;
            }
            if (status_task) {
                setStatusTask(status_task);
            } else {
                console.error('Status task not found');
            }
        } catch (error: any) {
            console.error('Error fetching status task:', error.message);
        }
    }
    // --------------------- get status task ---------------------

    if (!user_id || loading) {
        return (
            <>
                <Loader />
            </>
        );
    }

    return (
        <>
            <div className="header-task">
                <h1>Task Manager</h1>
                <p>{user_id}</p>
            </div>
            <div className="content-task">
                <div className="menu-task">
                    <h2>Your Task</h2>
                    <p className="add-task-btn" onClick={() => setPopup(!popup)}>{popup ? '- Close' : '+ Add Task'}</p>
                </div>




                <div className="task-board">
                    {popup &&
                        <div className="add-task-container">
                            <p className="form-title">Add Task</p>
                            <form onSubmit={InsertTask} className="add-task-form">
                                <input
                                    type="text"
                                    placeholder="Task"
                                    value={taskForm.task_name}
                                    onChange={(e) => setTaskForm({ ...taskForm, task_name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={taskForm.task_description}
                                    onChange={(e) => setTaskForm({ ...taskForm, task_description: e.target.value })}
                                />
                                <input
                                    type="date"
                                    onChange={(e) => setTaskForm({ ...taskForm, start_date: new Date(e.target.value) })}
                                />
                                <input
                                    type="date"
                                    onChange={(e) => setTaskForm({ ...taskForm, end_date: new Date(e.target.value) })}
                                />
                                <select
                                    name="status"
                                    id="status"
                                    onChange={(e) => setTaskForm({ ...taskForm, status_id: e.target.value })}
                                >
                                    <option value="">-- change status --</option>
                                    {statusTask?.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.status_name}
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>{uploading ? 'Uploading...' : 'Add'}</button>
                            </form>
                        </div>
                    }

                    <div className="task-column">
                        <h3>🟢 Plan ({task.filter(item => item.status_id === statusTask[0]?.id).length})</h3>
                        {task.filter(item => item.status_id === statusTask[0]?.id).map((item, index) => (
                            <div key={index} className="task-card">
                                <div>
                                    <p style={{ margin: '0' }}>{item.task_name} ({String(item.start_date).slice(0, 4)})</p>
                                    <p style={{ margin: '0' }}>{String(item.start_date).slice(5, 10)} to {String(item.end_date).slice(5, 10)}</p>
                                    <p className="task-description">description: <br />{item.task_description}</p>
                                </div>
                                <span onClick={() => UpdateTask(String(item.id), String(statusTask[1]?.id))} className="next-step-task" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>{uploading ? 'Wait...' : 'Next Step'}</span>
                            </div>
                        ))}
                    </div>

                    <div className="task-column">
                        <h3>🟡 In Progress ({task.filter(item => item.status_id === statusTask[1]?.id).length})</h3>
                        {task.filter(item => item.status_id === statusTask[1]?.id).map((item, index) => (
                            <div key={index} className="task-card">
                                <div>
                                    <p style={{ margin: '0' }}>{item.task_name} ({String(item.start_date).slice(0, 4)})</p>
                                    <p style={{ margin: '0' }}>{String(item.start_date).slice(5, 10)} to {String(item.end_date).slice(5, 10)}</p>
                                    <p className="task-description">{item.task_description}</p>
                                </div>
                                <span onClick={() => UpdateTask(String(item.id), String(statusTask[2]?.id))} className="next-step-task" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>{uploading ? 'Wait...' : 'Next Step'}</span>
                            </div>
                        ))}
                    </div>

                    <div className="task-column">
                        <h3>🟣 Complete ({task.filter(item => item.status_id === statusTask[2]?.id).length})</h3>
                        {task.filter(item => item.status_id === statusTask[2]?.id).map((item, index) => (
                            <div key={index} className="task-card">
                                <div>
                                    <p style={{ margin: '0' }}>{item.task_name} ({String(item.start_date).slice(0, 4)})</p>
                                    <p style={{ margin: '0' }}>{String(item.start_date).slice(5, 10)} to {String(item.end_date).slice(5, 10)}</p>
                                    <p className="task-description">{item.task_description}</p>
                                </div>
                                <span onClick={() => UpdateTask(String(item.id), String(statusTask[0]?.id))} className="next-step-task" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>{uploading ? 'Wait...' : 'Work Again'}</span>
                            </div>
                        ))}
                    </div>


                </div>



                <div className="table-task">
                    <table>
                        <thead className="thead-task">
                            <tr>
                                <th>id</th>
                                <th>task</th>
                                <th>description</th>
                                <th>start</th>
                                <th>end</th>
                                <th>status</th>
                                <th>action</th>
                                <th>delete</th>
                            </tr>
                        </thead>
                        <tbody className="tbody-task">
                            {task.filter((item) => !filterStatus || item.status_id === filterStatus)
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.task_name}</td>
                                        <td style={{ textAlign: 'left' }}>{item.task_description}</td>
                                        <td>{String(item.start_date)}</td>
                                        <td>{String(item.end_date)}</td>
                                        <td>{item.status_task?.status_name}</td>
                                        <td onClick={() => UpdateTask(String(item.id), String(statusTask[2]?.id))} className="Done-task" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>{uploading ? 'Wait...' : 'Done'}</td>
                                        <td onClick={() => DeleteTask(String(item.id))} className="remove-task" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>{uploading ? 'Wait...' : 'Remove'}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {statusTask.length === 0 &&
                    <div className="filter-status">
                        <select name="status-filter" id="" onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="" style={{ textAlign: 'center' }}>-- All --</option>
                            {statusTask.map((item, index) => (
                                <option key={index} value={item.id}>{item.status_name}-{item.description}</option>
                            ))}
                        </select>
                    </div>
                }
            </div>
        </>
    );
};

export default Task

