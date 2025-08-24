import React, { useState, useEffect } from 'react';
import '../style/ScheduleTable.css';
import { supabase } from '../../supabase/supabaseClient';
import type { ScheduleEntry } from '../../interface';
import { useLocation } from 'react-router-dom';


const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

const getLabelFromTime = (time: string) => {
    const index = timeSlots.indexOf(time);
    if (index < timeSlots.length - 1) {
        return `${time} - ${timeSlots[index + 1]}:00`;
    }
    return `${time} - 20:00`;
};



const ScheduleTable: React.FC = () => {
    const location = useLocation();
    const { state } = location;
    const { schedule_id } = state;
    
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newCourse, setNewCourse] = useState('');
    const [newDay, setNewDay] = useState('จันทร์');
    const [newStartTime, setNewStartTime] = useState('06:00');
    const [newEndTime, setNewEndTime] = useState('07:00');


    // ฟังก์ชันสำหรับดึงข้อมูลตารางเรียนจาก Supabase
    const fetchSchedules = async () => {
        const { data, error } = await supabase
            .from('schedules')
            .select('id, course, day, start_time, end_time')
            .order('created_at', { ascending: true })
            .eq('schedule_id', schedule_id);

        if (error) {
            console.error('Error fetching schedules:', error.message);
        } else {
            const formattedData = data.map((item: any) => ({
                id: item.id,
                schedule_id: item.schedule_id,
                course: item.course,
                day: item.day,
                startTime: item.start_time,
                endTime: item.end_time,
            }));
            setSchedule(formattedData);
        }
    };

    // ฟังก์ชันสำหรับเพิ่มวิชาใหม่
    const addCourse = async (entry: Omit<ScheduleEntry, 'id'>) => {
        const { data, error } = await supabase
            .from('schedules')
            .insert([
                {
                    schedule_id: schedule_id,
                    course: entry.course,
                    day: entry.day,
                    start_time: entry.startTime,
                    end_time: entry.endTime,
                },
            ])
            .select();

        if (error) {
            console.error('Error adding course:', error.message);
        } else {
            const newEntry = {
                id: data[0].id,
                schedule_id: data[0].schedule_id,
                course: data[0].course,
                day: data[0].day,
                startTime: data[0].start_time,
                endTime: data[0].end_time,
            };
            setSchedule([...schedule, newEntry]);
        }
    };

    // ฟังก์ชันสำหรับลบวิชา
    const removeCourse = async (id: string) => {
        const { error } = await supabase
            .from('schedules')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error removing course:', error.message);
        } else {
            setSchedule(schedule.filter(entry => entry.id !== id));
        }
    };

    // ดึงข้อมูลเมื่อ component ถูกโหลดครั้งแรก
    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleAddCourse = () => {
        if (timeSlots.indexOf(newEndTime) <= timeSlots.indexOf(newStartTime)) {
            alert('⚠️ เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น');
            return;
        }

        const startIndex = timeSlots.indexOf(newStartTime);
        const endIndex = timeSlots.indexOf(newEndTime);
        const selectedTimeRange = timeSlots.slice(startIndex, endIndex);

        const isConflict = selectedTimeRange.some(time =>
            schedule.some(entry =>
                entry.day === newDay &&
                timeSlots.indexOf(time) >= timeSlots.indexOf(entry.startTime) &&
                timeSlots.indexOf(time) < timeSlots.indexOf(entry.endTime)
            )
        );

        if (isConflict) {
            alert('⚠️ เวลานี้มีวิชาอื่นแล้ว กรุณาเลือกช่วงเวลาใหม่');
            return;
        }

        addCourse({
            course: newCourse,
            schedule_id: schedule_id,
            day: newDay,
            startTime: newStartTime,
            endTime: newEndTime,
        });

        setShowModal(false);
        setNewCourse('');
        setNewStartTime('06:00');
        setNewEndTime('07:00');
    };

    const handleRemoveCourse = (id: string) => {
        removeCourse(id);
    };

    const getCourse = (day: string, time: string) => {
        return schedule.find(
            (item) => item.day === day &&
                timeSlots.indexOf(time) >= timeSlots.indexOf(item.startTime) &&
                timeSlots.indexOf(time) < timeSlots.indexOf(item.endTime)
        );
    };

    return (
        <div className="schedule-container">
            <h1>ระบบจัดตารางสอน</h1>
            <p>{schedule_id}</p>
            <button className="add-button" onClick={() => setShowModal(true)}>
                + เพิ่มวิชา
            </button>

            <div className="table-wrapper">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>วัน / เวลา</th>
                            {timeSlots.slice(0, -1).map((time) => (
                                <th key={time}>{getLabelFromTime(time)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map((day) => (
                            <tr key={day}>
                                <td>{day}</td>
                                {timeSlots.slice(0, -1).map((time) => {
                                    const course = getCourse(day, time);
                                    return (
                                        <td key={time} className="table-cell">
                                            {course && (
                                                <div className="course-entry">
                                                    <span>{course.course}</span>
                                                    <button
                                                        className="remove-button"
                                                        onClick={() => handleRemoveCourse(course.id)}
                                                        title="ลบวิชา"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>เพิ่มวิชาใหม่</h2>
                        <div className="form-group">
                            <label>ชื่อวิชา:</label>
                            <input
                                type="text"
                                value={newCourse}
                                onChange={(e) => setNewCourse(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>วัน:</label>
                            <select value={newDay} onChange={(e) => setNewDay(e.target.value)}>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>เวลาเริ่มต้น:</label>
                            <select value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)}>
                                {timeSlots.slice(0, -1).map((time) => (
                                    <option key={time} value={time}>
                                        {time}:00
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>เวลาสิ้นสุด:</label>
                            <select value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)}>
                                {timeSlots.slice(1).map((time) => (
                                    <option key={time} value={time}>
                                        {time}:00
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleAddCourse}>บันทึก</button>
                            <button className="cancel" onClick={() => setShowModal(false)}>ยกเลิก</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleTable;