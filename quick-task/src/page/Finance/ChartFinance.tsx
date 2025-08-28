import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import ChartDataLabels from 'chartjs-plugin-datalabels'; // เพิ่ม plugin สำหรับแสดงค่าบนกราฟ
import type { TransactionInterface } from '../../interface';

// ลงทะเบียนองค์ประกอบที่จำเป็นของ Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels // ลงทะเบียน plugin
);

// ตั้งค่าตัวเลือกกราฟ (Options)
const options = {
    responsive: true,
    maintainAspectRatio: false, // ปรับเพื่อให้ควบคุมขนาดได้ง่ายขึ้น
    plugins: {
        legend: {
            display: false, // ซ่อน legend เพื่อความเรียบง่าย
        },
        title: {
            display: true,
            text: 'income-expense report',
            font: {
                size: 16,
                family: 'Arial, sans-serif',
            },
            color: '#2da44e',
        },
        tooltip: {
            callbacks: {
                label: function (context: any) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(context.parsed.y);
                    }
                    return label;
                }
            }
        },
        datalabels: {
            anchor: 'end' as const,
            align: 'top' as const,
            formatter: (value: number) => {
                return new Intl.NumberFormat('th-TH').format(value);
            },
            font: {
                size: 12,
                weight: 'bold' as const,
            },
            color: '#2da44e' as const,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                display: false, // ซ่อนเส้นตารางแนวนอน
            },
            ticks: {
                display: false, // ซ่อนตัวเลขแกน Y
            },
        },
        x: {
            grid: {
                display: false, // ซ่อนเส้นตารางแนวตั้ง
            },
            ticks: {
                font: {
                    size: 12,
                },
                color: '#2da44e',
            },
        },
    },
};

interface WeeklySpendingChartProps {
    transactions: TransactionInterface[];
    weeksToShow: number; // เพิ่มพารามิเตอร์จำนวนสัปดาห์
}

const WeeklySpendingChart: React.FC<WeeklySpendingChartProps> = ({ transactions, weeksToShow }) => {
    const prepareChartData = (txs: TransactionInterface[], weeks: number) => {
        const weeklyData = new Array(weeks).fill(0);
        const labels = [];
        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - (weeks * 7));

        for (let i = 0; i < weeks; i++) {
            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() - ((weeks - 1 - i) * 7));
            const startOfWeek = new Date(endOfWeek);
            startOfWeek.setDate(endOfWeek.getDate() - 6);

            const weeklyTotal = txs
                .filter(tx => {
                    const txDate = new Date(tx.transaction_date);
                    return txDate >= startOfWeek && txDate <= endOfWeek && tx.type === 'expense';
                })
                .reduce((sum, tx) => sum + (tx.amount || 0), 0);

            weeklyData[i] = weeklyTotal;
            labels[i] = `${startOfWeek.getDate()}-${endOfWeek.getDate()}`; // ใช้ช่วงวันที่เป็น label
        }

        // กำหนดสีแท่งกราฟให้สลับกัน
        const colors = ['#2da44e', '#3AA48C'];
        const backgroundColors = weeklyData.map((_, index) => colors[index % colors.length]);

        return {
            labels,
            datasets: [
                {
                    label: 'Weekly Spending',
                    data: weeklyData,
                    backgroundColor: backgroundColors,
                    borderRadius: 8, // ทำให้ปลายแท่งกราฟโค้งมน
                },
            ],
        };
    };

    const data = useMemo(() => prepareChartData(transactions, weeksToShow), [transactions, weeksToShow]);

    return (
        <div style={{height: '250px'}}>
            <Bar options={options} data={data} />
        </div>
    );
};

export default WeeklySpendingChart;