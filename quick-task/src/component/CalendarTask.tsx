import { useState } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import type { View } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { TaskInterface } from '../interface'

const localizer = dayjsLocalizer(dayjs)

const CalendarTask = ({ tasks }: { tasks: TaskInterface[] }) => {
    const [currentDate, setCurrentDate] = useState(new Date()) // state คุมวันที่
    const [currentView, setCurrentView] = useState<View>('month') // state คุม view

    const events = tasks
        .filter((task) => task.start_date && task.end_date)
        .map((task) => ({
            id: task.id ?? '',
            title: task.task_name ?? 'Untitled',
            start: new Date(task.start_date as Date),
            end: new Date(task.end_date as Date),
            status_id: task.status_id
        }))

    return (
        <div style={{ height: '60vh' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                view={currentView}
                onView={(view) => setCurrentView(view)}
                views={['day', 'week', 'month', 'agenda']}
                style={{ height: '100%' }}
                eventPropGetter={(event) => {
                    let backgroundColor = '#3174ad' // default

                    // ตัวอย่าง: เปลี่ยนสีตาม status_id
                    switch (event.status_id) {
                        case '83741b49-d9f1-418c-96a8-9930f6ae77cb':
                            backgroundColor = '#52CB8C'
                            break
                        case '191587a8-7b78-4bbc-8f7f-ffecd1b3983c':
                            backgroundColor = '#E2AD44'
                            break
                        case '06d3ed01-58e0-4535-97a3-779e846b4fe5':
                            backgroundColor = '#9B83D4'
                            break
                        default:
                            backgroundColor = '#007bff'
                    }

                    return {
                        style: {
                            backgroundColor,
                            color: 'black',
                            borderRadius: '6px',
                            border: 'none',
                            padding: '2px 6px',
                        },
                    }
                }}
            />
        </div>
    )
}

export default CalendarTask
