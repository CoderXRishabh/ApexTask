import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format, isToday } from 'date-fns';
import {
  taskMessages,
  goalMessages,
  routineMessages,
  motivationalMessages,
  getRandomMessage,
  formatMessage,
  getTimeOfDay,
  getCompletionEmoji,
  getCompletionMessage,
  sendNotification,
  minutesToMs,
  hoursToMs
} from '../services/notificationService';

const AppContext = createContext();

const defaultNotificationSettings = {
  tasks: {
    enabled: true,
    intervalMinutes: 60,
    reminderTime: 'morning', // morning, afternoon, evening
  },
  goals: {
    enabled: true,
    reminderTime: '09:00',
    streakAlerts: true,
  },
  routines: {
    enabled: true,
    morningTime: '07:00',
    eveningTime: '20:00',
  },
  motivation: {
    enabled: true,
    intervalHours: 3,
  }
};

const initialState = {
  tasks: [],
  goals: [],
  routines: [],
  routineChecks: {},
  user: {
    name: '',
    avatar: null,
  },
  notificationsEnabled: false,
  notificationSettings: defaultNotificationSettings,
  isModalOpen: false,
  modalSelectedDate: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    case 'TOGGLE_MODAL':
      return { ...state, isModalOpen: action.payload, modalSelectedDate: action.date || null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload),
      };
    case 'TOGGLE_GOAL_DAY':
      return {
        ...state,
        goals: state.goals.map((goal) => {
          if (goal.id === action.payload.goalId) {
            const dateStr = action.payload.dateStr;
            const newProgress = goal.progress?.includes(dateStr)
              ? goal.progress.filter(d => d !== dateStr)
              : [...(goal.progress || []), dateStr];
            return { ...goal, progress: newProgress };
          }
          return goal;
        }),
      };
    case 'ADD_ROUTINE':
      return { ...state, routines: [...state.routines, action.payload] };
    case 'DELETE_ROUTINE':
      return {
        ...state,
        routines: state.routines.filter((r) => r.id !== action.payload),
      };
    case 'TOGGLE_ROUTINE_CHECK':
      const { routineId, dateStr } = action.payload;
      const currentChecks = state.routineChecks[dateStr] || [];
      const isChecked = currentChecks.includes(routineId);
      const newChecks = isChecked
        ? currentChecks.filter(id => id !== routineId)
        : [...currentChecks, routineId];
      return {
        ...state,
        routineChecks: {
          ...state.routineChecks,
          [dateStr]: newChecks,
        },
      };
    case 'SET_NOTIFICATIONS':
      return { ...state, notificationsEnabled: action.payload };
    case 'UPDATE_NOTIFICATION_SETTINGS':
      return {
        ...state,
        notificationSettings: {
          ...state.notificationSettings,
          [action.payload.category]: {
            ...state.notificationSettings[action.payload.category],
            ...action.payload.settings,
          },
        },
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [theme, setTheme] = useState('dark');
  const notificationIntervals = useRef({});

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('apex-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Load data from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('apex-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Merge with defaults for notification settings
      if (!parsed.notificationSettings) {
        parsed.notificationSettings = defaultNotificationSettings;
      }
      dispatch({ type: 'LOAD_DATA', payload: parsed });
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    const dataToSave = {
      tasks: state.tasks,
      goals: state.goals,
      routines: state.routines,
      routineChecks: state.routineChecks,
      user: state.user,
      notificationsEnabled: state.notificationsEnabled,
      notificationSettings: state.notificationSettings,
    };
    localStorage.setItem('apex-data', JSON.stringify(dataToSave));
  }, [state.tasks, state.goals, state.routines, state.routineChecks, state.user, state.notificationsEnabled, state.notificationSettings]);

  // Notification scheduling effect
  useEffect(() => {
    if (!state.notificationsEnabled) {
      // Clear all intervals if notifications disabled
      Object.values(notificationIntervals.current).forEach(clearInterval);
      notificationIntervals.current = {};
      return;
    }

    const { notificationSettings, tasks, goals, routines, routineChecks } = state;

    // Clear existing intervals
    Object.values(notificationIntervals.current).forEach(clearInterval);
    notificationIntervals.current = {};

    // Task notifications
    if (notificationSettings.tasks.enabled) {
      notificationIntervals.current.tasks = setInterval(() => {
        const todayTasks = tasks.filter(t => isToday(new Date(t.date)));
        const remaining = todayTasks.filter(t => !t.completed).length;

        if (remaining > 0) {
          const timeOfDay = getTimeOfDay();
          const messages = taskMessages[timeOfDay];
          const template = getRandomMessage(messages);
          const message = formatMessage(template, { count: todayTasks.length, remaining });
          sendNotification(message.title, message.body, { tag: 'task-reminder' });
        } else if (todayTasks.length > 0) {
          // All tasks completed!
          const template = getRandomMessage(taskMessages.completion);
          sendNotification(template.title, template.body, { tag: 'task-completion' });
        }
      }, minutesToMs(notificationSettings.tasks.intervalMinutes));
    }

    // Goal notifications
    if (notificationSettings.goals.enabled) {
      notificationIntervals.current.goals = setInterval(() => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');

        goals.forEach(goal => {
          const isCheckedToday = goal.progress?.includes(todayStr);
          if (!isCheckedToday) {
            const template = getRandomMessage(goalMessages.checkIn);
            const day = Math.floor((new Date() - new Date(goal.startDate)) / (1000 * 60 * 60 * 24)) + 1;
            const message = formatMessage(template, {
              title: goal.title,
              day: Math.min(day, goal.durationDays),
              total: goal.durationDays,
              streak: goal.progress?.length || 0
            });
            sendNotification(message.title, message.body, { tag: `goal-${goal.id}` });
          }
        });
      }, hoursToMs(2)); // Check every 2 hours
    }

    // Routine notifications
    if (notificationSettings.routines.enabled) {
      notificationIntervals.current.routines = setInterval(() => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const todayChecks = routineChecks[todayStr] || [];
        const completed = todayChecks.length;
        const total = routines.length;

        if (total > 0 && completed < total) {
          const hour = new Date().getHours();
          if (hour >= 7 && hour < 10) {
            // Morning reminder
            const template = getRandomMessage(routineMessages.morning);
            const message = formatMessage(template, { count: total });
            sendNotification(message.title, message.body, { tag: 'routine-morning' });
          } else if (hour >= 19 && hour < 21) {
            // Evening summary
            const template = getRandomMessage(routineMessages.evening);
            const emoji = getCompletionEmoji(completed, total);
            const summaryMessage = getCompletionMessage(completed, total);
            const message = formatMessage(template, {
              completed,
              total,
              emoji,
              message: summaryMessage
            });
            sendNotification(message.title, message.body, { tag: 'routine-evening' });
          }
        } else if (total > 0 && completed === total) {
          const template = getRandomMessage(routineMessages.completion);
          sendNotification(template.title, template.body, { tag: 'routine-complete' });
        }
      }, hoursToMs(1)); // Check every hour
    }

    // Motivational notifications
    if (notificationSettings.motivation.enabled) {
      notificationIntervals.current.motivation = setInterval(() => {
        const template = getRandomMessage(motivationalMessages);
        sendNotification(template.title, template.body, { tag: 'motivation' });
      }, hoursToMs(notificationSettings.motivation.intervalHours));
    }

    return () => {
      Object.values(notificationIntervals.current).forEach(clearInterval);
    };
  }, [state.notificationsEnabled, state.notificationSettings, state.tasks, state.goals, state.routines, state.routineChecks]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('apex-theme', newTheme);
  };

  const addTask = (title, date, priority = 'medium', category = 'general') => {
    const newTask = {
      id: uuidv4(),
      title,
      date: date || new Date().toISOString(),
      completed: false,
      priority,
      category,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const toggleTask = (id) => dispatch({ type: 'TOGGLE_TASK', payload: id });
  const deleteTask = (id) => dispatch({ type: 'DELETE_TASK', payload: id });

  const addGoal = (title, durationDays = 90) => {
    const newGoal = {
      id: uuidv4(),
      title,
      startDate: new Date().toISOString(),
      durationDays,
      progress: [],
    };
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
  };

  const deleteGoal = (id) => dispatch({ type: 'DELETE_GOAL', payload: id });

  const toggleGoalDay = (goalId, date) => {
    const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
    dispatch({ type: 'TOGGLE_GOAL_DAY', payload: { goalId, dateStr } });
  };

  const addRoutine = (title) => {
    const newRoutine = {
      id: uuidv4(),
      title,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ROUTINE', payload: newRoutine });
  };

  const deleteRoutine = (id) => dispatch({ type: 'DELETE_ROUTINE', payload: id });

  const toggleRoutineCheck = (routineId, date = new Date()) => {
    const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
    dispatch({ type: 'TOGGLE_ROUTINE_CHECK', payload: { routineId, dateStr } });
  };

  const isRoutineCheckedToday = (routineId) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return state.routineChecks[todayStr]?.includes(routineId) || false;
  };
  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const toggleNotifications = async () => {
    if (state.notificationsEnabled) {
      // Turn off notifications (app-level, browser permission stays)
      dispatch({ type: 'SET_NOTIFICATIONS', payload: false });
    } else {
      // Turn on - request permission if not already granted
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          dispatch({ type: 'SET_NOTIFICATIONS', payload: true });
        } else {
          const permission = await Notification.requestPermission();
          dispatch({ type: 'SET_NOTIFICATIONS', payload: permission === 'granted' });
        }
      }
    }
  };

  const requestNotificationPermission = toggleNotifications; // Alias for backwards compatibility

  const updateNotificationSettings = (category, settings) => {
    dispatch({ type: 'UPDATE_NOTIFICATION_SETTINGS', payload: { category, settings } });
  };

  // Test notification function - uses REAL data
  const sendTestNotification = (type) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    let template, message;

    switch (type) {
      case 'tasks':
        const todayTasks = state.tasks.filter(t => isToday(new Date(t.date)));
        const pendingTasks = todayTasks.filter(t => !t.completed);

        if (pendingTasks.length === 0 && todayTasks.length === 0) {
          sendNotification("📋 No Tasks", "You have no tasks for today. Enjoy your free time! 🎉", { tag: 'test-task' });
        } else if (pendingTasks.length === 0) {
          template = getRandomMessage(taskMessages.completion);
          sendNotification(template.title, template.body, { tag: 'test-task' });
        } else {
          template = getRandomMessage(taskMessages[getTimeOfDay()]);
          message = formatMessage(template, { count: todayTasks.length, remaining: pendingTasks.length });
          sendNotification(message.title, message.body, { tag: 'test-task' });
        }
        break;

      case 'goals':
        const uncheckedGoals = state.goals.filter(g => !g.progress?.includes(todayStr));

        if (state.goals.length === 0) {
          sendNotification("🎯 No Goals", "Create a goal to start tracking your progress! ✨", { tag: 'test-goal' });
        } else if (uncheckedGoals.length === 0) {
          sendNotification("🎯 All Checked In!", "You've checked in all your goals today! Amazing! 🏆", { tag: 'test-goal' });
        } else {
          const goal = uncheckedGoals[0];
          const day = Math.floor((new Date() - new Date(goal.startDate)) / (1000 * 60 * 60 * 24)) + 1;
          const streak = goal.progress?.length || 0;
          template = getRandomMessage(goalMessages.checkIn);
          message = formatMessage(template, {
            title: goal.title,
            day: Math.min(day, goal.durationDays),
            total: goal.durationDays,
            streak
          });
          sendNotification(message.title, message.body, { tag: 'test-goal' });
        }
        break;

      case 'routines':
        const todayChecks = state.routineChecks[todayStr] || [];
        const pendingRoutines = state.routines.filter(r => !todayChecks.includes(r.id));

        if (state.routines.length === 0) {
          sendNotification("☀️ No Routines", "Add some daily routines to build great habits! 🌱", { tag: 'test-routine' });
        } else if (pendingRoutines.length === 0) {
          template = getRandomMessage(routineMessages.completion);
          sendNotification(template.title, template.body, { tag: 'test-routine' });
        } else {
          template = getRandomMessage(routineMessages.morning);
          message = formatMessage(template, { count: pendingRoutines.length });
          sendNotification(message.title, message.body, { tag: 'test-routine' });
        }
        break;

      case 'motivation':
        template = getRandomMessage(motivationalMessages);
        sendNotification(template.title, template.body, { tag: 'test-motivation' });
        break;

      default:
        break;
    }
  };

  const openModal = (date = null) => dispatch({ type: 'TOGGLE_MODAL', payload: true, date });
  const closeModal = () => dispatch({ type: 'TOGGLE_MODAL', payload: false });

  return (
    <AppContext.Provider
      value={{
        ...state,
        theme,
        toggleTheme,
        addTask,
        toggleTask,
        deleteTask,
        addGoal,
        deleteGoal,
        toggleGoalDay,
        addRoutine,
        deleteRoutine,
        toggleRoutineCheck,
        isRoutineCheckedToday,
        updateUser,
        requestNotificationPermission,
        updateNotificationSettings,
        sendTestNotification,
        openModal,
        closeModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
