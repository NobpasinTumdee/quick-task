import { useEffect, useState } from "react"
import { supabase } from "../supabase/supabaseClient"
import type { StatusTaskInterface, TaskInterface } from "../interface";

const Task = () => {
    const [user, setUser] = useState<any>(null);
    const [task, setTask] = useState<TaskInterface[]>([]);
    const [statusTask , setStatusTask] = useState<StatusTaskInterface[]>([]);
    const [taskForm, setTaskForm] = useState<TaskInterface>({
        task_name: '',
        task_description: '',
        start_date: new Date(),
        end_date: new Date(),
        user_id: '',
        status_id: ''
    });

    useEffect(() => {
        handleSignup();
        getStatusTask();
    }, []);

    useEffect(() => {
        if (user) {
            getTask();
        }
    }, [user]);

    const handleSignup = async () => {
        try {
            const { data: { user: userFromSupabase } } = await supabase.auth.getUser();
            if (userFromSupabase) {
                // console.table(userFromSupabase);
                setUser(userFromSupabase);
                setTaskForm({ ...taskForm, user_id: userFromSupabase.id });
            }
        } catch (error) {
            console.error("Error getting user:", error);
        }
    };

    const getTask = async () => {
        if (!user) {
            console.error('User not found');
            return;
        }
        try {
            const { data, error, status } = await supabase
                .from('task')
                .select(`*,status_task (
                    status_name
                )`)
                .eq('user_id', user.id);

            if (error && status !== 406) {
                throw error;
            }
            if (data) {
                // console.table(data);
                setTask(data);
            } else {
                console.error('Task not found');
            }
        } catch (error: any) {
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
            // console.table(taskForm);
            const { error } = await supabase
                .from('task')
                .insert(taskForm);
            if (error) {
                throw error;
            }
            getTask();
        } catch (error: any) {
            console.error('Error inserting task:', error.message);
        }
    }

    const UpdateTask = async (id: string) => {
        if (!id) {
            console.error('Error updating task: id is null or undefined');
            return;
        }
        try {
            const { error } = await supabase
                .from('task')
                .update({ status_id: '06d3ed01-58e0-4535-97a3-779e846b4fe5' })
                .eq('id', id);
            if (error) {
                throw error;
            }
            await getTask();
        } catch (error: any) {
            console.error('Error updating task:', error.message);
        }
    }


    const DeleteTask = async (id: string) => {
        if (!id) {
            console.error('Error deleting task: id is null or undefined');
            return;
        }
        try {
            const { error } = await supabase
                .from('task')
                .delete()
                .eq('id', id);
            if (error) {
                throw error;
            }
            await getTask();
        } catch (error: any) {
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

    if (!user) {
        return (
            <h1 style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>กำลังตรวจสอบสิทธิ์...</h1>
        );
    }

    return (
        <>
            <h1>Task</h1>
            <h2>{user.email}</h2>
            <div>
                <h1>Add Task</h1>
                <form onSubmit={InsertTask}>
                    <input type="text" placeholder="task" value={taskForm.task_name} onChange={(e) => setTaskForm({ ...taskForm, task_name: e.target.value })} />
                    <input type="text" placeholder="description" value={taskForm.task_description} onChange={(e) => setTaskForm({ ...taskForm, task_description: e.target.value })} />
                    <input type="date" onChange={(e) => setTaskForm({ ...taskForm, start_date: new Date(e.target.value) })} />
                    <input type="date" onChange={(e) => setTaskForm({ ...taskForm, end_date: new Date(e.target.value) })} />
                    <select name="status" id="status" onChange={(e) => setTaskForm({ ...taskForm, status_id: e.target.value })}>
                        <option value="">-- change status --</option>
                        {statusTask.map((item, index) => (
                            <option key={index} value={item.id}>{item.status_name}</option>
                        ))}
                    </select>
                    <button type="submit">Add</button>
                </form>
            </div>
            <div>
                <table>
                    <thead>
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
                    <tbody>
                        {task.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.task_name}</td>
                                <td>{item.task_description}</td>
                                <td>{String(item.start_date)}</td>
                                <td>{String(item.end_date)}</td>
                                <td>{item.status_task?.status_name}</td>
                                <td onClick={() => UpdateTask(String(item.id))}>Completed</td>
                                <td onClick={() => DeleteTask(String(item.id))}>Delete Task</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Task

