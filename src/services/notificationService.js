// Notification Service - Personal Assistant Style Messages with Emojis

// Task notification messages
export const taskMessages = {
    morning: [
        { title: "☀️ Good Morning!", body: "You have {count} tasks lined up today. Let's make it count! 💪" },
        { title: "🌅 Rise & Shine!", body: "Ready to crush {count} tasks today? I believe in you! ✨" },
        { title: "☕ Morning Check-in", body: "{count} tasks await you. Start strong, finish stronger! 🚀" },
    ],
    afternoon: [
        { title: "🌤️ Afternoon Nudge", body: "Hey! {remaining} tasks still on your list. Keep going! 💪" },
        { title: "⏰ Quick Reminder", body: "Don't forget about your remaining {remaining} tasks! 🎯" },
        { title: "🔔 Midday Check", body: "{remaining} tasks left. You're doing awesome! Keep it up! ⭐" },
    ],
    evening: [
        { title: "🌆 Evening Heads Up", body: "{remaining} tasks for today. Still time to finish strong! 💫" },
        { title: "🌙 Final Push!", body: "Only {remaining} tasks left. You've got this! 🙌" },
        { title: "✨ Almost There!", body: "Just {remaining} more tasks. End the day on a high note! 🎉" },
    ],
    completion: [
        { title: "🎉 AMAZING!", body: "All tasks completed! You're a productivity rockstar! 🌟" },
        { title: "🏆 Champion!", body: "Every task done! Treat yourself, you earned it! 🍰" },
        { title: "🥳 Woohoo!", body: "Zero tasks remaining! Now that's what I call crushing it! 💪" },
    ],
    individual: [
        { title: "📋 Task Reminder", body: "Don't forget: '{title}' - You can do this! ✨" },
        { title: "🎯 Focus Time", body: "'{title}' is waiting for you. Small steps, big wins! 🚶" },
        { title: "⭐ Gentle Nudge", body: "Remember '{title}'? Now's a great time to tackle it! 💪" },
    ]
};

// Goal notification messages
export const goalMessages = {
    checkIn: [
        { title: "🔥 Streak Alert!", body: "Time to check in for '{title}'! Day {day} of {total} 💪" },
        { title: "🎯 Daily Check-in", body: "Keep your '{title}' streak alive! You're on Day {day}! 🏃" },
        { title: "💪 Don't Break It!", body: "'{title}' check-in time! {streak}% consistency so far! ⭐" },
    ],
    motivation: [
        { title: "🌟 You're Amazing!", body: "Day {day} on '{title}'! Every day counts! 💫" },
        { title: "🏆 Keep Going!", body: "'{title}' - You've checked in {checkedDays} times! Incredible! 🎊" },
        { title: "🚀 Momentum!", body: "Your '{title}' journey continues! Stay consistent! 💪" },
    ],
    milestone: [
        { title: "🎉 7-Day Streak!", body: "One week on '{title}'! You're building real habits! 🏅" },
        { title: "🏅 14-Day Milestone!", body: "Two weeks strong on '{title}'! Unstoppable! 🔥" },
        { title: "🥇 30-Day Champion!", body: "A full month on '{title}'! You're a legend! 👑" },
    ],
    missed: [
        { title: "👋 Hey there!", body: "Haven't seen you check in for '{title}' today. Still time! ⏰" },
        { title: "🤗 Friendly Reminder", body: "'{title}' misses you! A quick check-in keeps the momentum! 💫" },
        { title: "💭 Psst...", body: "Your '{title}' goal is waiting. Every check-in counts! ✨" },
    ]
};

// Routine notification messages
export const routineMessages = {
    morning: [
        { title: "☀️ Good Morning!", body: "Your {count} routines are ready! Start your day right! 🌅" },
        { title: "🌞 Rise & Routine!", body: "Time to kick off {count} daily habits! Let's go! 💪" },
        { title: "☕ Morning Ritual", body: "{count} routines await! Build the day you deserve! ✨" },
    ],
    individual: [
        { title: "✨ Routine Time!", body: "'{title}' is up! Small habits, big changes! 🌱" },
        { title: "🔔 Quick Reminder", body: "Time for '{title}'! You've got this! 💪" },
        { title: "🎯 Habit Check", body: "Don't forget '{title}' today! Every day counts! ⭐" },
    ],
    evening: [
        { title: "🌙 Evening Summary", body: "You completed {completed}/{total} routines today! {emoji}" },
        { title: "📊 Daily Wrap-up", body: "{completed}/{total} routines done. {message} 💫" },
        { title: "🌆 End of Day", body: "Routine check: {completed}/{total}. {message} ✨" },
    ],
    completion: [
        { title: "🎉 Perfect Day!", body: "All routines completed! You're building an amazing lifestyle! 🏆" },
        { title: "🥳 Routine Master!", body: "Every single routine done! Consistency is your superpower! 💪" },
        { title: "🌟 Flawless!", body: "100% routine completion! Keep being awesome! ⭐" },
    ]
};

// Motivational messages (random throughout the day)
export const motivationalMessages = [
    { title: "💫 Daily Inspiration", body: "Every expert was once a beginner. Keep going! 🚀" },
    { title: "🌟 You've Got This!", body: "Small progress is still progress. Be proud of yourself! 💪" },
    { title: "✨ Believe", body: "You're capable of amazing things. Trust the process! 🌈" },
    { title: "🔥 Fire Within", body: "Your dedication is inspiring! Keep that fire burning! 🔥" },
    { title: "🌱 Growth Mindset", body: "Challenges help you grow. Embrace them! 💚" },
    { title: "💪 Strength", body: "You're stronger than you think. Keep pushing! 🏋️" },
    { title: "🎯 Focus", body: "Stay focused on your goals. You're doing incredible! ⭐" },
    { title: "🌻 Positivity", body: "Choose to see the good. Your mindset shapes your day! ☀️" },
    { title: "🚀 Momentum", body: "Keep the momentum going! Every step matters! 🌟" },
    { title: "💖 Self-Care", body: "Remember to be kind to yourself today. You deserve it! 🌸" },
    { title: "🎨 Creativity", body: "You bring something unique to the world. Never forget that! ✨" },
    { title: "🏆 Champion", body: "You're writing your own success story. Make it legendary! 📖" },
];

// Helper function to get random message from array
export const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
};

// Helper to format message with data
export const formatMessage = (template, data) => {
    let result = { ...template };
    Object.keys(data).forEach(key => {
        result.title = result.title.replace(`{${key}}`, data[key]);
        result.body = result.body.replace(`{${key}}`, data[key]);
    });
    return result;
};

// Get time of day for appropriate messages
export const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
};

// Get evening summary emoji based on completion
export const getCompletionEmoji = (completed, total) => {
    const percent = total > 0 ? (completed / total) * 100 : 0;
    if (percent === 100) return '🎉';
    if (percent >= 80) return '🌟';
    if (percent >= 50) return '👍';
    if (percent >= 25) return '💪';
    return '🤗';
};

// Get evening summary message
export const getCompletionMessage = (completed, total) => {
    const percent = total > 0 ? (completed / total) * 100 : 0;
    if (percent === 100) return "Perfect score! Amazing!";
    if (percent >= 80) return "Great job today!";
    if (percent >= 50) return "Solid effort! Keep it up!";
    if (percent >= 25) return "Every bit counts!";
    return "Tomorrow's a new day!";
};

// Send browser notification
export const sendNotification = (title, body, options = {}) => {
    if (!('Notification' in window)) {
        console.log('Browser does not support notifications');
        return;
    }

    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: options.tag || 'apextask-notification',
            requireInteraction: options.requireInteraction || false,
            silent: options.silent || false,
            ...options
        });

        // Auto-close after 8 seconds
        setTimeout(() => notification.close(), 8000);

        return notification;
    }
};

// Notification delay helper (convert to milliseconds)
export const minutesToMs = (minutes) => minutes * 60 * 1000;
export const hoursToMs = (hours) => hours * 60 * 60 * 1000;
