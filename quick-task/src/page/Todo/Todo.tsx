import React, { useState, useEffect } from 'react';
import { format, subDays, addDays } from 'date-fns';
import '../style/Todo.css'
import { supabase } from '../../supabase/supabaseClient';
import type { TodoItem } from '../../interface';
import { message } from 'antd';
import QuickLoader from '../../component/Loader/Quick';

const user_id = localStorage.getItem('user_id');

// CalendarBar Component
const CalendarBar: React.FC<{ selectedDate: Date; onDateChange: (date: Date) => void }> = ({ selectedDate, onDateChange }) => {
    const dates = [
        subDays(selectedDate, 2),
        subDays(selectedDate, 1),
        selectedDate,
        addDays(selectedDate, 1),
        addDays(selectedDate, 2),
    ];

    return (
        <div className="calendar-bar">
            {dates.map((date, index) => (
                <button
                    key={index}
                    className={`date-tab ${format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') ? 'active' : ''}`}
                    onClick={() => onDateChange(date)}
                >
                    <div className="day-name">{format(date, 'E')}</div>
                    <div className="day-number">{format(date, 'd')}</div>
                </button>
            ))}
        </div>
    );
};

// TodoList Component
const TodoList: React.FC<{ todos: TodoItem[] }> = ({ todos }) => {
    if (todos.length === 0) {
        return <div className="no-todos">ไม่มีรายการที่ต้องทำในวันนี้ 🎉</div>;
    }

    const handleDoneTodo = async (todoId: string) => {
        try {
            const { data, error } = await supabase
                .from('todos')
                .update({ is_completed: true })
                .eq('id', todoId)
                .select()
            if (error) {
                throw error;
            }
            if (data) {
                message.open({
                    type: 'success',
                    content: 'Todo completed.',
                });
                // Refresh the page to show updated todo list
                window.location.reload();
            }

        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className="todo-list">
            {todos.map((todo) => (
                <div key={todo.id} className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
                    <div>
                        <span className="todo-time">{todo.time}</span>
                        <span className="todo-task">{todo.task}</span>
                    </div>
                    <svg style={{ cursor: 'pointer' }} onClick={() => handleDoneTodo(todo.id)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268.24-224.7 34.59-458.35 99-522l170 170 63.65 63.65-64.41 63.65ZM494-232.35 259.87-466.48 324-530.89l170 170 367.52-367.52L925.65-664 494-232.35Zm0-233.89-64.41-63.65 198-198L692-664.24l-198 198Z" /></svg>
                </div>
            ))}
        </div>
    );
};

const Todo = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [allTodos, setAllTodos] = useState<TodoItem[]>([]);

    const [newTask, setNewTask] = useState<string>('');
    const [newDueDate, setNewDueDate] = useState<string>('');
    const [newTime, setNewTime] = useState<string>('00:00');

    const [Wait, setWait] = useState<boolean>(false);
    const [popUp, setPopup] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchAllTodos();
    }, []);

    const fetchAllTodos = async () => {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user_id)
            .order('time', { ascending: true }); // จัดเรียงตามเวลา

        if (error) {
            console.error('Error fetching all todos:', error.message);
            return;
        }
        if (data) {
            setAllTodos(data);
        } else {
            setAllTodos([]);
        }
        setLoading(false);
    };

    // useEffect ที่สอง: กรองข้อมูลที่ถูกดึงมาแล้วตามวันที่ที่เลือก
    useEffect(() => {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const filteredTodos = allTodos.filter(todo => todo.due_date === formattedDate);
        setTodos(filteredTodos);

    }, [selectedDate, allTodos]); // จะทำงานใหม่เมื่อ selectedDate หรือ allTodos เปลี่ยน

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const insertTodo = async (task: string, due_date: string, time: string) => {
        if (!task || !due_date || !time) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        try {
            setWait(true);
            const { data, error } = await supabase
                .from('todos')
                .insert([
                    {
                        task: task,
                        due_date: due_date,
                        time: time,
                        is_completed: false,
                        user_id: user_id
                    },
                ])
                .select()
            if (error) {
                throw error;
            } if (data) {
                setTodos([...todos, data[0]]);
                setAllTodos([...allTodos, data[0]]);
                messageApi.open({
                    type: 'success',
                    content: 'Todo created.',
                });
                setWait(false);
            }
        } catch (error) {
            alert("Error inserting todo:" + error);
            setWait(false);
        }

    }

    if (loading) {
        return <QuickLoader />;
    }

    return (
        <div className="app-container">
            {contextHolder}
            <h1 className="app-title">Todo List</h1>
            <CalendarBar selectedDate={selectedDate} onDateChange={handleDateChange} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
                <p className="date-header">งานที่ต้องทำในวันที่ {format(selectedDate, 'dd/MM/yyyy')}</p>
                <svg style={{ cursor: 'pointer' }} onClick={() => setPopup(!popUp)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--todo-active)"><path d="M202.87-111.87q-37.78 0-64.39-26.61t-26.61-64.39v-554.26q0-37.78 26.61-64.39t64.39-26.61h239.04v91H202.87v554.26h554.26v-239.04h91v239.04q0 37.78-26.61 64.39t-64.39 26.61H202.87Zm439.04-410.04v-120h-120v-86.22h120v-120h86.22v120h120v86.22h-120v120h-86.22Z" /></svg>
            </div>

            {popUp &&
                <div className="add-todo">
                    <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} required />
                    <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} required />
                    <select name="time" id="time" defaultValue={"00:00"} required onChange={(e) => setNewTime(e.target.value)}>
                        <option value="01:00">01:00</option>
                        <option value="02:00">02:00</option>
                        <option value="03:00">03:00</option>
                        <option value="04:00">04:00</option>
                        <option value="05:00">05:00</option>
                        <option value="06:00">06:00</option>
                        <option value="07:00">07:00</option>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                        <option value="21:00">21:00</option>
                        <option value="22:00">22:00</option>
                        <option value="23:00">23:00</option>
                        <option value="00:00">24:00</option>
                    </select>
                    {Wait ?
                        <svg className="animation-clock" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--todo-active)">
                            <path d="M480-520q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--todo-active)" onClick={() => insertTodo(newTask, newDueDate, newTime)} style={{ cursor: 'pointer' }}>
                            <path d="M480-640 280-440l56 56 104-103v407h80v-407l104 103 56-56-200-200ZM146-260q-32-49-49-105T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 59-17 115t-49 105l-58-58q22-37 33-78t11-84q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 43 11 84t33 78l-58 58Z" />
                        </svg>
                    }
                </div>
            }
            <TodoList todos={todos} />
        </div>
    );
}

export default Todo

