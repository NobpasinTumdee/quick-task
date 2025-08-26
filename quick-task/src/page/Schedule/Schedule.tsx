import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import type { total_schedules } from '../../interface';
import { message } from 'antd';
import '../style/ScheduleTable.css'
import Loader2 from '../../component/Loader/Loader2';

const Schedule = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const user_id = localStorage.getItem('user_id');
    const [loading, setLoading] = useState(true);
    const [Wait, setWait] = useState(false);
    const [schedules, setSchedules] = useState<total_schedules[]>([]);
    const [scheduleFrom, setScheduleFrom] = useState<total_schedules>({
        user_id: String(user_id),
        name: '',
        created_at: new Date(),
    });
    const handNavigate = (schedule_id: string) => {
        navigate('/schedule', { state: { schedule_id: schedule_id } });
    };

    useEffect(() => {
        fetchSchedules();
    }, [])

    const fetchSchedules = async () => {
        try {
            const { data: total_schedules, error } = await supabase
                .from('total_schedules')
                .select('*')
                .eq('user_id', user_id);
            if (error) {
                console.error("Error fetching wallet:", error);
                return;
            }
            if (total_schedules) {
                setSchedules(total_schedules);
                setLoading(false);
            }

        } catch (error) {
            alert("Error fetching wallet:" + error);
        }
    }

    const insertSchedule = async () => {
        try {
            setWait(true);
            const { data, error } = await supabase
                .from('total_schedules')
                .insert(scheduleFrom)
                .select()
            if (error) {
                throw error;
            }
            if (data) {
                setSchedules([...schedules, data[0]]);
                setWait(false);
                messageApi.open({
                    type: 'success',
                    content: 'Schedule created.',
                });
            }
        } catch (error) {
            alert("Error inserting schedule:" + error);
        }
    }

    const DeleteSchedule = async (id: string) => {
        try {
            setWait(true);
            const { data, error } = await supabase
                .from('total_schedules')
                .delete()
                .eq('id', id).select()
            if (error) {
                throw error;
            }
            if (data) {
                await ClearAllSchedule(id);
                setSchedules(schedules.filter(item => item.id !== id));
                setWait(false);
                messageApi.open({
                    type: 'success',
                    content: 'Schedule created.',
                });
            }
        } catch (error) {
            alert("Error deleting schedule:" + error);
        }
    }

    const ClearAllSchedule = async (schedule_id: string) => {
        try {
            const { error } = await supabase
                .from('schedules')
                .delete()
                .eq('schedule_id', schedule_id)
            if (error) {
                throw error;
            }
        } catch (error) {
            alert("Error deleting schedule:" + error);
        }
    }

    if (!user_id || loading) {
        return (
            <>
                <Loader2 />
            </>
        );
    }

    return (
        <>
            {contextHolder}
            <div className="schedule-container">
                <header className="schedule-header">
                    <h1>📚 ตารางเรียนของฉัน</h1>
                    <p className="header-subtitle">เลือกดูตารางสอนตามเทอมที่ต้องการ</p>
                </header>
                <div className='schedule-form'>
                    <input
                        type="text"
                        placeholder="ชื่อตารางเรียน"
                        value={scheduleFrom.name}
                        onChange={(e) => setScheduleFrom({ ...scheduleFrom, name: e.target.value })}
                    />
                    {Wait ? (
                        <button style={{ cursor: 'not-allowed', color: 'gray', backgroundColor: 'lightgray' }}>Wait</button>
                    ) : (
                        <button onClick={insertSchedule}>Create Schedule</button>
                    )}
                </div>
                <div className="schedule-list-grid">
                    {schedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className="schedule-card"
                        >
                            <div className="card-content">
                                <div>
                                    <h2 className="card-title">{schedule.name}</h2>
                                    <p className="card-subtitle">
                                        {new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(schedule.created_at))}
                                        <svg onClick={() => DeleteSchedule(String(schedule.id))} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#0077cc" style={{ cursor: 'pointer' }}>
                                            <path d="M304.62-160q-26.85 0-45.74-18.88Q240-197.77 240-224.62V-720h-40v-40h160v-30.77h240V-760h160v40h-40v495.38q0 27.62-18.5 46.12Q683-160 655.38-160H304.62ZM680-720H280v495.38q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h350.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93V-720ZM392.31-280h40v-360h-40v360Zm135.38 0h40v-360h-40v360ZM280-720v520-520Z" />
                                        </svg>
                                    </p>
                                </div>
                                <span className="card-arrow" onClick={() => handNavigate(String(schedule.id))}>→</span>
                            </div>
                        </div>
                    ))}
                </div>
                {schedules.length === 0 && (
                    <div className="no-schedules-found">
                        <p>ไม่พบตารางเรียนในขณะนี้ 😔</p>
                        <p>ลองสร้างตารางเรียนใหม่ได้เลย!</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Schedule
