import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { format, subDays, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { ChartBar, ChartLine, Target, Fire, CaretLeft, CaretRight } from '@phosphor-icons/react';

export function AnalyticsPage() {
    const { tasks, goals, theme } = useApp();
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today);
    const isLight = theme === 'light';

    // Theme-aware colors
    const accentColor = isLight ? '#b8860b' : '#8b5cf6';
    const secondaryAccent = isLight ? '#cd853f' : '#ec4899';
    const tooltipBg = isLight ? 'var(--bg-card)' : '#18181b';
    const tooltipBorder = isLight ? 'var(--border-glass)' : '#3f3f46';
    const tickColor = isLight ? '#6b5344' : '#71717a';
    const cursorFill = isLight ? 'rgba(184, 134, 11, 0.1)' : 'rgba(255,255,255,0.05)';
    const cursorStroke = isLight ? 'rgba(184, 134, 11, 0.2)' : 'rgba(255,255,255,0.1)';
    const gridStroke = isLight ? 'rgba(139, 90, 43, 0.08)' : 'rgba(255,255,255,0.05)';
    const pendingBarColor = isLight ? 'rgba(139, 90, 43, 0.15)' : 'rgba(255,255,255,0.1)';
    const iconBg1 = isLight ? 'rgba(184, 134, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)';
    const iconBg2 = isLight ? 'rgba(205, 133, 63, 0.1)' : 'rgba(236, 72, 153, 0.1)';
    const buttonBg = isLight ? 'var(--bg-hover)' : 'rgba(255,255,255,0.05)';

    // Weekly Tasks Data (last 7 days)
    const getWeeklyTasksData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = subDays(today, i);
            const dayTasks = tasks.filter(task => isSameDay(new Date(task.date), date));
            const completed = dayTasks.filter(t => t.completed).length;
            const total = dayTasks.length;
            data.push({
                name: days[date.getDay()],
                completed,
                total,
                pending: total - completed
            });
        }
        return data;
    };

    // Monthly Tasks Data (current month by day)
    const getMonthlyTasksData = () => {
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

        return allDays.map(day => {
            const dayTasks = tasks.filter(task => isSameDay(new Date(task.date), day));
            const completed = dayTasks.filter(t => t.completed).length;
            return {
                name: format(day, 'd'),
                completed,
                total: dayTasks.length
            };
        });
    };

    // Weekly Goals Data (last 7 days check-ins per goal)
    const getWeeklyGoalsData = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = subDays(today, i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayData = { name: format(date, 'EEE') };

            goals.forEach(goal => {
                const isChecked = goal.progress?.includes(dateStr) ? 1 : 0;
                dayData[goal.title] = isChecked;
            });

            days.push(dayData);
        }
        return days;
    };

    // Monthly Goals Data (selected month)
    const getMonthlyGoalsData = (month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

        return allDays.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayData = { name: format(day, 'd') };

            goals.forEach(goal => {
                const isChecked = goal.progress?.includes(dateStr) ? 1 : 0;
                dayData[goal.title] = isChecked;
            });

            return dayData;
        });
    };

    const weeklyTasksData = getWeeklyTasksData();
    const monthlyTasksData = getMonthlyTasksData();
    const weeklyGoalsData = getWeeklyGoalsData();
    const monthlyGoalsData = getMonthlyGoalsData(selectedMonth);

    const handlePrevMonth = () => setSelectedMonth(prev => subMonths(prev, 1));
    const handleNextMonth = () => {
        const next = addMonths(selectedMonth, 1);
        if (next <= today) setSelectedMonth(next);
    };

    // Calculate totals
    const weeklyCompleted = weeklyTasksData.reduce((sum, d) => sum + d.completed, 0);
    const weeklyTotal = weeklyTasksData.reduce((sum, d) => sum + d.total, 0);
    const monthlyCompleted = monthlyTasksData.reduce((sum, d) => sum + d.completed, 0);
    const monthlyTotal = monthlyTasksData.reduce((sum, d) => sum + d.total, 0);

    // Goal colors (work in both themes)
    const goalColors = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div>
                <h1 className="title-gradient" style={{ fontSize: '28px', marginBottom: '6px' }}>Analytics</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Track your productivity trends and goal progress
                </p>
            </div>

            {/* Tasks Analytics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Weekly Tasks Card */}
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ padding: '8px', background: iconBg1, borderRadius: '10px' }}>
                            <ChartBar size={20} color={accentColor} weight="duotone" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Weekly Tasks</h3>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {weeklyCompleted}/{weeklyTotal} completed this week
                            </p>
                        </div>
                    </div>
                    <div style={{ height: '180px' }}>
                        <ResponsiveContainer>
                            <BarChart data={weeklyTasksData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: cursorFill }}
                                    contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)' }}
                                    formatter={(value, name) => [value, name === 'completed' ? 'Completed' : 'Pending']}
                                />
                                <Bar dataKey="completed" fill={accentColor} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pending" fill={pendingBarColor} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Tasks Card */}
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ padding: '8px', background: iconBg2, borderRadius: '10px' }}>
                            <ChartLine size={20} color={secondaryAccent} weight="duotone" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Monthly Tasks</h3>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {monthlyCompleted}/{monthlyTotal} completed in {format(today, 'MMMM')}
                            </p>
                        </div>
                    </div>
                    <div style={{ height: '180px' }}>
                        <ResponsiveContainer>
                            <LineChart data={monthlyTasksData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: tickColor, fontSize: 9 }}
                                    interval={4}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ stroke: cursorStroke }}
                                    contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)' }}
                                    formatter={(value) => [value, 'Completed']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="completed"
                                    stroke={secondaryAccent}
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 5, fill: secondaryAccent }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Goals Analytics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                {/* Weekly Goals Card */}
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
                            <Target size={20} color="#10b981" weight="duotone" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Weekly Goals</h3>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {goals.length} active goal{goals.length !== 1 ? 's' : ''} this week
                            </p>
                        </div>
                    </div>
                    <div style={{ height: '180px' }}>
                        {goals.length > 0 ? (
                            <ResponsiveContainer>
                                <BarChart data={weeklyGoalsData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 11 }} />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: cursorFill }}
                                        contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)' }}
                                        formatter={(value, name) => [value === 1 ? '✓ Done' : '✗ Missed', name]}
                                    />
                                    {goals.map((goal, i) => (
                                        <Bar
                                            key={goal.id}
                                            dataKey={goal.title}
                                            fill={goalColors[i % goalColors.length]}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                No goals to track yet
                            </div>
                        )}
                    </div>
                    {goals.length > 0 && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                            {goals.map((goal, i) => (
                                <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: goalColors[i % goalColors.length] }} />
                                    {goal.title.length > 12 ? goal.title.slice(0, 12) + '...' : goal.title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Monthly Goals Card */}
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px' }}>
                                <Fire size={20} color="#f59e0b" weight="duotone" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Monthly Goals</h3>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    Goal streaks
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={handlePrevMonth}
                                style={{
                                    background: buttonBg,
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '6px',
                                    padding: '6px',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    display: 'flex'
                                }}
                            >
                                <CaretLeft size={14} weight="bold" />
                            </button>
                            <span style={{ fontSize: '12px', fontWeight: '500', minWidth: '80px', textAlign: 'center' }}>
                                {format(selectedMonth, 'MMM yyyy')}
                            </span>
                            <button
                                onClick={handleNextMonth}
                                disabled={format(selectedMonth, 'yyyy-MM') === format(today, 'yyyy-MM')}
                                style={{
                                    background: buttonBg,
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '6px',
                                    padding: '6px',
                                    cursor: format(selectedMonth, 'yyyy-MM') === format(today, 'yyyy-MM') ? 'not-allowed' : 'pointer',
                                    color: format(selectedMonth, 'yyyy-MM') === format(today, 'yyyy-MM') ? 'var(--text-muted)' : 'var(--text-secondary)',
                                    display: 'flex',
                                    opacity: format(selectedMonth, 'yyyy-MM') === format(today, 'yyyy-MM') ? 0.5 : 1
                                }}
                            >
                                <CaretRight size={14} weight="bold" />
                            </button>
                        </div>
                    </div>
                    <div style={{ height: '180px' }}>
                        {goals.length > 0 ? (
                            <ResponsiveContainer>
                                <LineChart data={monthlyGoalsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: tickColor, fontSize: 9 }}
                                        interval={4}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ stroke: cursorStroke }}
                                        contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', fontSize: '12px', color: 'var(--text-primary)' }}
                                        formatter={(value, name) => [value === 1 ? '✓ Done' : '✗ Missed', name]}
                                    />
                                    {goals.map((goal, i) => (
                                        <Line
                                            key={goal.id}
                                            type="stepAfter"
                                            dataKey={goal.title}
                                            stroke={goalColors[i % goalColors.length]}
                                            strokeWidth={3}
                                            dot={false}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                No goals to track yet
                            </div>
                        )}
                    </div>
                    {goals.length > 0 && (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                            {goals.map((goal, i) => (
                                <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: goalColors[i % goalColors.length] }} />
                                    {goal.title.length > 12 ? goal.title.slice(0, 12) + '...' : goal.title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
