const STORAGE_KEYS = {
    meetingProcessed: 'syncmind_notif_meeting_processed',
    actionItemsReminder: 'syncmind_notif_action_items_reminder',
};

export const isNotificationSupported = () =>
    typeof window !== 'undefined' && 'Notification' in window;

export const getNotificationPermission = () =>
    isNotificationSupported() ? Notification.permission : 'unsupported';

export const requestNotificationPermission = async () => {
    if (!isNotificationSupported()) return 'unsupported';
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
        return Notification.permission;
    }
    try {
        return await Notification.requestPermission();
    } catch (err) {
        console.warn('[Notifications] Permission request failed:', err);
        return Notification.permission;
    }
};

export const sendNotification = (title, options = {}) => {
    if (!isNotificationSupported() || Notification.permission !== 'granted') return;
    try {
        new Notification(title, options);
    } catch (err) {
        console.warn('[Notifications] Failed to show notification:', err);
    }
};

export const getMeetingProcessedPref = () =>
    localStorage.getItem(STORAGE_KEYS.meetingProcessed) !== 'false';

export const setMeetingProcessedPref = (enabled) =>
    localStorage.setItem(STORAGE_KEYS.meetingProcessed, String(enabled));

export const getActionItemsReminderPref = () =>
    localStorage.getItem(STORAGE_KEYS.actionItemsReminder) !== 'false';

export const setActionItemsReminderPref = (enabled) =>
    localStorage.setItem(STORAGE_KEYS.actionItemsReminder, String(enabled));
