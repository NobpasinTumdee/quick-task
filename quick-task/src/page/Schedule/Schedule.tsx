import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import type { total_schedules } from '../../interface';

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
            <div>
                <h1>Schedule</h1>
            </div>
            <div>
                {schedules.map((schedule) => (
                    <div key={schedule.id}>
                        <p>{schedule.name}</p>
                        <button onClick={() => handNavigate(schedule.id)}>go to schedule</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Schedule
