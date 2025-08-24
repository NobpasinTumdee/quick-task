import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import type { total_schedules } from '../../interface';
import '../style/ScheduleTable.css'

const Schedule = () => {
    const navigate = useNavigate();
    const user_id = localStorage.getItem('user_id');
    const [schedules, setSchedules] = useState<total_schedules[]>([]);
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
            }

        } catch (error) {
            alert("Error fetching wallet:" + error);
        }
    }
    return (
        <>
            <div className="schedule-container">
                <header className="schedule-header">
                    <h1>📚 ตารางเรียนของฉัน</h1>
                    <p className="header-subtitle">เลือกดูตารางสอนตามเทอมที่ต้องการ</p>
                </header>
                <div className="schedule-list-grid">
                    {schedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className="schedule-card"
                            onClick={() => handNavigate(schedule.id)}
                        >
                            <div className="card-content">
                                <h2 className="card-title">เทอม {schedule.name}</h2>
                                <p className="card-subtitle">ภาคการศึกษาที่ {schedule.name}</p>
                                <span className="card-arrow">→</span>
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
