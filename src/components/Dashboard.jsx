import React from 'react';
import { useApp } from '../context/AppContext';
import { format, isToday, subDays, isSameDay, differenceInDays, addDays } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { CheckCircle, Circle, Target, Fire, Trash, Check } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const { tasks, goals, toggleTask, deleteTask, toggleGoalDay, user, theme } = useApp();
    const navigate = useNavigate();
    const isLight = theme === 'light';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const todayTasks = tasks.filter(task => isToday(new Date(task.date)));
    const completedToday = todayTasks.filter(t => t.completed).length;
    const progress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

    const getActivityData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = subDays(today, i);
            const dayTasks = tasks.filter(task => isSameDay(new Date(task.date), date));
            const completedCount = dayTasks.filter(t => t.completed).length;
            data.push({ name: days[date.getDay()], tasks: completedCount, total: dayTasks.length });
        }
        return data;
    };

    const activityData = getActivityData();
    const pieData = [
        { name: 'Completed', value: completedToday || 0 },
        { name: 'Remaining', value: Math.max(0, todayTasks.length - completedToday) },
    ];
    const safePieData = todayTasks.length === 0 ? [{ name: 'No Tasks', value: 1 }] : pieData;

    // Theme-aware colors
    const accentColor = isLight ? '#b8860b' : '#8b5cf6';
    const secondaryAccent = isLight ? '#cd853f' : '#ec4899';
    const emptyColor = isLight ? 'rgba(139, 90, 43, 0.1)' : 'rgba(255,255,255,0.1)';
    const COLORS = [accentColor, emptyColor];

    const tooltipBg = isLight ? '#f5efe6' : '#18181b';
    const tooltipBorder = isLight ? '#d4c4a8' : '#3f3f46';
    const cursorFill = isLight ? 'rgba(184, 134, 11, 0.1)' : 'rgba(255,255,255,0.05)';
    const tickColor = isLight ? '#6b5344' : '#52525b';

    const taskRowBg = isLight ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.03)';
    const goalCardBg = isLight
        ? 'linear-gradient(145deg, rgba(205, 133, 63, 0.12) 0%, var(--bg-card) 100%)'
        : 'linear-gradient(145deg, rgba(236, 72, 153, 0.1) 0%, rgba(9, 9, 11, 0.4) 100%)';

    const activeGoal = goals.length > 0 ? goals[goals.length - 1] : null;

    const getGoalInfo = (goal) => {
        if (!goal) return null;
        const startDate = new Date(goal.startDate);
        const currentDay = Math.max(1, differenceInDays(new Date(), startDate) + 1);
        const endDate = addDays(startDate, goal.durationDays);
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const isCheckedToday = goal.progress?.includes(todayStr);
        const totalChecked = goal.progress?.length || 0;
        const streakPercent = Math.round((totalChecked / currentDay) * 100);
        return { currentDay, endDate, isCheckedToday, totalChecked, streakPercent };
    };

    const goalInfo = getGoalInfo(activeGoal);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Greeting */}
            <div>
                <h1 className="title-gradient" style={{ fontSize: '27px', marginBottom: '6px' }}>
                    {getGreeting()}, {user?.name || 'user'}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {todayTasks.length - completedToday > 0
                        ? `You have ${todayTasks.length - completedToday} tasks remaining today. Stay focused!`
                        : todayTasks.length > 0
                            ? "Great job! You've completed all tasks for today! 🎉"
                            : "No tasks for today. Add one to get started!"}
                </p>
            </div>

            {/* Top Row - All 3 cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'stretch' }}>

                {/* Daily Progress Card */}
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>
                        Daily Progress
                    </h3>
                    <div style={{ width: '80px', height: '80px', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={safePieData} innerRadius={26} outerRadius={38} paddingAngle={3} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                                    {safePieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {Math.round(progress)}%
                        </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '10px' }}>
                        {completedToday} of {todayTasks.length} completed
                    </p>
                </div>

                {/* Goals Card */}
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', background: goalCardBg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {activeGoal && goalInfo ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Target size={18} color={secondaryAccent} weight="duotone" />
                                <h3 style={{ fontSize: '13px', fontWeight: '600' }}>Current Goal</h3>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', textAlign: 'center' }}>{activeGoal.title}</div>
                            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>
                                Day {Math.min(goalInfo.currentDay, activeGoal.durationDays)}
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}> / {activeGoal.durationDays}</span>
                            </div>
                            <button onClick={() => toggleGoalDay(activeGoal.id, new Date())} style={{ padding: '8px 16px', background: goalInfo.isCheckedToday ? 'rgba(16, 185, 129, 0.2)' : `rgba(${isLight ? '184, 134, 11' : '236, 72, 153'}, 0.2)`, color: goalInfo.isCheckedToday ? 'var(--success)' : secondaryAccent, border: goalInfo.isCheckedToday ? '1px solid var(--success)' : `1px solid ${secondaryAccent}40`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', fontSize: '11px' }}>
                                {goalInfo.isCheckedToday ? (<><Check weight="bold" size={12} /> Done!</>) : (<><Fire weight="fill" size={12} /> Check in</>)}
                            </button>
                        </>
                    ) : (
                        <>
                            <Target size={24} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                            <p style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '12px' }}>No active goal</p>
                            <button onClick={() => navigate('/goals')} className="btn-primary" style={{ padding: '7px 14px', fontSize: '11px' }}>Create Goal</button>
                        </>
                    )}
                </div>

                {/* Weekly Activity Card */}
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>
                        Weekly Activity
                    </h3>
                    <div style={{ height: '120px', width: '100%' }}>
                        <ResponsiveContainer>
                            <BarChart data={activityData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 9 }} />
                                <Tooltip cursor={{ fill: cursorFill }} contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '6px', fontSize: '10px', color: 'var(--text-primary)' }} formatter={(value, name, props) => [`${value}/${props.payload.total}`, 'Tasks']} />
                                <Bar dataKey="tasks" fill={accentColor} radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Today's Tasks - Full Width */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px' }}>Today's Tasks</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                    {todayTasks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '34px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                            No tasks for today. Add one to get started!
                        </div>
                    ) : (
                        todayTasks.map(task => (
                            <div key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', background: taskRowBg, borderRadius: '10px', gap: '10px' }}>
                                <div onClick={() => toggleTask(task.id)} style={{ cursor: 'pointer' }}>
                                    {task.completed ? <CheckCircle size={20} color="var(--success)" weight="fill" /> : <Circle size={20} color="var(--text-muted)" />}
                                </div>
                                <span style={{ flex: 1, fontSize: '13px', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                    {task.title}
                                </span>
                                <span style={{ fontSize: '10px', padding: '3px 7px', borderRadius: '5px', background: task.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' : task.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-hover)', color: task.priority === 'high' ? 'var(--danger)' : task.priority === 'medium' ? 'var(--warning)' : 'var(--text-secondary)' }}>
                                    {task.priority}
                                </span>
                                <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '3px' }}>
                                    <Trash size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
