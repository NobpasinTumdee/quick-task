import React, { useState, useEffect } from 'react';
import { format, subDays, addDays } from 'date-fns';
import '../style/Todo.css'
import { supabase } from '../../supabase/supabaseClient';
import type { TodoItem } from '../../interface';

const user_id = localStorage.getItem('user_id');

// CalendarBar Component
const CalendarBar: React.FC<{ selectedDate: Date; onDateChange: (date: Date) => void }> = ({ selectedDate, onDateChange }) => {
    const dates = [
        subDays(selectedDate, 1),
        selectedDate,
        addDays(selectedDate, 1),
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

    return (
        <div className="todo-list">
            {todos.map((todo) => (
                <div key={todo.id} className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
                    <span className="todo-time">{todo.time}</span>
                    <span className="todo-task">{todo.task}</span>
                </div>
            ))}
        </div>
    );
};

const Todo = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [allTodos, setAllTodos] = useState<TodoItem[]>([]);

    useEffect(() => {
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
            setAllTodos(data || []);
        };

        fetchAllTodos();

    }, []); // Dependency array เป็น [] ทำให้ฟังก์ชันทำงานแค่ครั้งเดียวเมื่อ Component ถูก render ครั้งแรก

    // useEffect ที่สอง: กรองข้อมูลที่ถูกดึงมาแล้วตามวันที่ที่เลือก
    useEffect(() => {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const filteredTodos = allTodos.filter(todo => todo.due_date === formattedDate);
        setTodos(filteredTodos);

    }, [selectedDate, allTodos]); // จะทำงานใหม่เมื่อ selectedDate หรือ allTodos เปลี่ยน

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Todo List</h1>
            <CalendarBar selectedDate={selectedDate} onDateChange={handleDateChange} />
            <TodoList todos={todos} />
            <h1>ยังไม่ได้ทำ เน้อ รอแปป นึง</h1>
        </div>
    );
}

export default Todo
