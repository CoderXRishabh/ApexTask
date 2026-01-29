import React, { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
    isBefore,
    differenceInDays
} from 'date-fns';
import { CaretLeft, CaretRight, Plus, Check, X } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { tasks, goals, openModal, toggleGoalDay } = useApp();

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekDaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const numWeeks = Math.ceil(days.length / 7);

    const getTasksForDay = (day) => {
        return tasks.filter(task => isSameDay(new Date(task.date), day));
    };

    const getActiveGoalsForDay = (day) => {
        return goals.filter(goal => {
            const goalStart = new Date(goal.startDate);
            const goalEnd = new Date(goalStart);
            goalEnd.setDate(goalEnd.getDate() + goal.durationDays);
            return day >= goalStart && day <= goalEnd;
        });
    };

    const isGoalCheckedForDay = (goal, day) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        return goal.progress?.includes(dayStr);
    };

    const isGoalMissedForDay = (goal, day) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDay = new Date(day);
        checkDay.setHours(0, 0, 0, 0);

        const goalStart = new Date(goal.startDate);
        goalStart.setHours(0, 0, 0, 0);

        return checkDay >= goalStart && checkDay < today && !isGoalCheckedForDay(goal, day);
    };

    const handleDayClick = (day) => {
        openModal(day.toISOString());
    };

    return (
        <div className="calendar-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden'
        }}>
            {/* Header - Fixed */}
            <div className="glass-panel" style={{
                padding: '16px 20px',
                borderRadius: '16px',
                marginBottom: '16px',
                flexShrink: 0
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 className="title-gradient" style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '700' }}>
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={prevMonth} className="btn-primary" style={{ padding: '8px', borderRadius: '50%', width: '36px', height: '36px', justifyContent: 'center' }}>
                            <CaretLeft weight="bold" />
                        </button>
                        <button onClick={nextMonth} className="btn-primary" style={{ padding: '8px', borderRadius: '50%', width: '36px', height: '36px', justifyContent: 'center' }}>
                            <CaretRight weight="bold" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid - Scrollable */}
            <div className="glass-panel" style={{
                flex: 1,
                minHeight: 0,
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* Week Header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    marginBottom: '8px',
                    textAlign: 'center',
                    flexShrink: 0
                }}>
                    {weekDays.map((day, i) => (
                        <div key={day} style={{
                            color: 'var(--text-secondary)',
                            fontWeight: '600',
                            fontSize: 'clamp(10px, 2vw, 13px)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            padding: '8px 0'
                        }}>
                            <span className="day-full">{day}</span>
                            <span className="day-short" style={{ display: 'none' }}>{weekDaysShort[i]}</span>
                        </div>
                    ))}
                </div>

                {/* Days Grid - Scrollable */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    minHeight: 0
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 'clamp(4px, 1vw, 8px)',
                        paddingBottom: '8px'
                    }}>
                        {days.map((day) => {
                            const dayTasks = getTasksForDay(day);
                            const activeGoals = getActiveGoalsForDay(day);
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isTodayDate = isToday(day);

                            const hasMissedGoal = activeGoals.some(g => isGoalMissedForDay(g, day));
                            const hasCheckedGoal = activeGoals.some(g => isGoalCheckedForDay(g, day));

                            return (
                                <div
                                    key={day.toString()}
                                    onClick={() => handleDayClick(day)}
                                    style={{
                                        background: hasMissedGoal
                                            ? 'rgba(239, 68, 68, 0.1)'
                                            : hasCheckedGoal
                                                ? 'rgba(16, 185, 129, 0.1)'
                                                : isTodayDate
                                                    ? 'rgba(139, 92, 246, 0.15)'
                                                    : 'rgba(255, 255, 255, 0.02)',
                                        border: isTodayDate
                                            ? '2px solid var(--accent-primary)'
                                            : hasMissedGoal
                                                ? '1px solid rgba(239, 68, 68, 0.3)'
                                                : hasCheckedGoal
                                                    ? '1px solid rgba(16, 185, 129, 0.3)'
                                                    : '1px solid var(--border-glass)',
                                        borderRadius: 'clamp(8px, 1.5vw, 12px)',
                                        padding: 'clamp(6px, 1vw, 10px)',
                                        opacity: isCurrentMonth ? 1 : 0.3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        minHeight: 'clamp(60px, 10vw, 90px)',
                                        aspectRatio: 'auto'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (isCurrentMonth) {
                                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.background = hasMissedGoal
                                            ? 'rgba(239, 68, 68, 0.1)'
                                            : hasCheckedGoal
                                                ? 'rgba(16, 185, 129, 0.1)'
                                                : isTodayDate
                                                    ? 'rgba(139, 92, 246, 0.15)'
                                                    : 'rgba(255, 255, 255, 0.02)';
                                    }}
                                >
                                    {/* Day Number */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '4px'
                                    }}>
                                        <span style={{
                                            fontWeight: '600',
                                            fontSize: 'clamp(12px, 2vw, 14px)',
                                            color: isTodayDate ? 'var(--accent-primary)' : 'var(--text-primary)'
                                        }}>
                                            {format(day, 'd')}
                                        </span>
                                        <div style={{
                                            width: 'clamp(14px, 2vw, 18px)',
                                            height: 'clamp(14px, 2vw, 18px)',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0.6
                                        }}>
                                            <Plus size={10} weight="bold" />
                                        </div>
                                    </div>

                                    {/* Goal Indicator */}
                                    {activeGoals.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '2px',
                                            marginBottom: '2px'
                                        }}>
                                            {hasCheckedGoal ? (
                                                <Check size={10} color="var(--success)" weight="bold" />
                                            ) : hasMissedGoal ? (
                                                <X size={10} color="var(--danger)" weight="bold" />
                                            ) : null}
                                            <span style={{
                                                fontSize: 'clamp(8px, 1.2vw, 10px)',
                                                color: hasCheckedGoal ? 'var(--success)' : hasMissedGoal ? 'var(--danger)' : 'var(--accent-secondary)',
                                                fontWeight: '600'
                                            }}>
                                                {activeGoals.length}G
                                            </span>
                                        </div>
                                    )}

                                    {/* Tasks */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', flex: 1 }}>
                                        {dayTasks.slice(0, 2).map((task) => (
                                            <div key={task.id} style={{
                                                fontSize: 'clamp(8px, 1.2vw, 9px)',
                                                padding: '2px 4px',
                                                borderRadius: '4px',
                                                background: task.completed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                                                color: task.completed ? 'var(--success)' : 'var(--text-primary)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                textDecoration: task.completed ? 'line-through' : 'none'
                                            }}>
                                                {task.title}
                                            </div>
                                        ))}
                                        {dayTasks.length > 2 && (
                                            <div style={{ fontSize: 'clamp(7px, 1vw, 9px)', color: 'var(--text-muted)' }}>
                                                +{dayTasks.length - 2}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div style={{
                    display: 'flex',
                    gap: 'clamp(12px, 2vw, 24px)',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-glass)',
                    flexWrap: 'wrap',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.3)' }}></div>
                        <span style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: 'var(--text-muted)' }}>Done</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.3)' }}></div>
                        <span style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: 'var(--text-muted)' }}>Missed</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', border: '2px solid var(--accent-primary)' }}></div>
                        <span style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: 'var(--text-muted)' }}>Today</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
