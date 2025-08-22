import { useEffect, useState } from "react"
import { supabase } from "../supabase/supabaseClient"
import type { StatusTaskInterface, TaskInterface } from "../interface";
import { message } from 'antd';
import './style/task.css'
import Loader from "../component/Loader";
import CalendarTask from "../component/CalendarTask";

import Aos from 'aos';
import 'aos/dist/aos.css';

const Task = () => {
    const user_id = localStorage.getItem('user_id');
    const [messageApi, contextHolder] = message.useMessage();
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

    useEffect(() => { Aos.init({ duration: 1000, once: true, }); }, []);



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
                messageApi.open({
                    type: 'success',
                    content: 'Task created.',
                });
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
                messageApi.open({
                    type: 'success',
                    content: 'Task updated.',
                });
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
                messageApi.open({
                    type: 'success',
                    content: 'Task deleted.',
                });
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
            {contextHolder}
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
                        <div className="task-column-container">
                            {task.filter(item => item.status_id === statusTask[0]?.id).map((item, index) => (
                                <div key={index} className="task-card" data-aos="fade-up" data-aos-duration={`${index + 1}00`}>
                                    <div>
                                        <p style={{ margin: '0' }}>{item.task_name} ({String(item.start_date).slice(0, 4)})</p>
                                        <p style={{ margin: '0' }}>{String(item.start_date).slice(5, 10)} to {String(item.end_date).slice(5, 10)}</p>
                                        <p className="task-description">description: <br />{item.task_description}</p>
                                    </div>
                                    {uploading ?
                                        <span className="next-step-task" style={{ cursor: 'none', pointerEvents: 'none' }}>
                                            <svg className="animation-clock" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--text-main)"><path d="M480-520q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" /></svg>
                                        </span>
                                        :
                                        <>
                                            <span onClick={() => UpdateTask(String(item.id), String(statusTask[1]?.id))} className="next-step-task" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--text-main)"><path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z" /></svg>
                                            </span>
                                        </>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="task-column">
                        <h3>🟡 In Progress ({task.filter(item => item.status_id === statusTask[1]?.id).length})</h3>
                        <div className="task-column-container">
                            {task.filter(item => item.status_id === statusTask[1]?.id).map((item, index) => (
                                <div key={index} className="task-card" data-aos="fade-right" data-aos-duration={`${index + 1}00`}>
                                    <div className="task-card-detail">
                                        <p style={{ margin: '0' }}>{item.task_name} ({String(item.start_date).slice(0, 4)})</p>
                                        <p style={{ margin: '0' }}>{String(item.start_date).slice(5, 10)} to {String(item.end_date).slice(5, 10)}</p>
                                        <p className="task-description">description: <br />{item.task_description}</p>
                                    </div>
                                    {uploading ?
                                        <span className="next-step-task" style={{ cursor: 'none', pointerEvents: 'none' }}>
                                            <svg className="animation-clock" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--text-main)"><path d="M480-520q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" /></svg>
                                        </span>
                                        :
                                        <>
                                            <span onClick={() => UpdateTask(String(item.id), String(statusTask[0]?.id))} className="next-step-task" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--text-main)"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" /></svg>
                                            </span>
                                            <span onClick={() => UpdateTask(String(item.id), String(statusTask[2]?.id))} className="next-step-task" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--text-main)"><path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z" /></svg>
                                            </span>
                                        </>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="task-column">
                        <h3>🟣 Complete ({task.filter(item => item.status_id === statusTask[2]?.id).length})</h3>
                        <div className="task-column-container">
                            {task.filter(item => item.status_id === statusTask[2]?.id).map((item, index) => (
                                <div key={index} className="task-card" data-aos="fade-right" data-aos-duration={`${index + 1}00`}>
                                    <div>
                                        <p style={{ margin: '0' }}>{item.task_name} ({String(item.start_date).slice(0, 4)})</p>
                                        <p style={{ margin: '0' }}>{String(item.start_date).slice(5, 10)} to {String(item.end_date).slice(5, 10)}</p>
                                        <p className="task-description">description: <br />{item.task_description}</p>
                                    </div>
                                    {uploading ?
                                        <span className="next-step-task" style={{ cursor: 'none', pointerEvents: 'none' }}>
                                            <svg className="animation-clock" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--text-main)"><path d="M480-520q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" /></svg>
                                        </span>
                                        :
                                        <>
                                            <span onClick={() => UpdateTask(String(item.id), String(statusTask[0]?.id))} className="next-step-task" style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--text-main)"><path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z" /></svg>
                                            </span>
                                        </>
                                    }
                                </div>
                            ))}
                        </div>
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
                                        <td>
                                            <p className="Done-task" onClick={() => UpdateTask(String(item.id), String(statusTask[2]?.id))} style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>
                                                {uploading ? 'Wait...' : 'Done'}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="remove-task" onClick={() => DeleteTask(String(item.id))} style={{ cursor: uploading ? 'none' : 'pointer', pointerEvents: uploading ? 'none' : 'auto' }}>
                                                {uploading ? 'Wait...' : 'Remove'}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {statusTask.length > 0 &&
                    <div className="filter-status">
                        <select name="status-filter" id="" onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="" style={{ textAlign: 'center' }}>-- All --</option>
                            {statusTask.map((item, index) => (
                                <option key={index} value={item.id}>{item.status_name}-{item.description}</option>
                            ))}
                        </select>
                    </div>
                }
                <div style={{ margin: '5% 5%' }}>
                    <CalendarTask tasks={task} />
                </div>
            </div>
        </>
    );
};

export default Task

