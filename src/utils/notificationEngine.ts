import { Mission } from '../types';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }
  return false;
};

export const sendLocalNotification = (title: string, body: string, icon = '/pwa-192x192.png') => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
      });
    } catch (e) {
      console.warn('Native notification failed, fallback to console', e);
    }
  }
};

// Tracks notified mission IDs to prevent duplicate alarms in the same session
const notifiedMissions = new Set<string>();

export const checkUpcomingAgendaReminders = (missions: Mission[], lang: 'id' | 'en' = 'id') => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  missions.forEach((m) => {
    if (m.completed || !m.dateStr || !m.time) return;
    if (m.dateStr !== todayStr) return;

    // Parse time string "HH:MM"
    const parts = m.time.split(':');
    if (parts.length < 2) return;
    const eventMinutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    if (isNaN(eventMinutes)) return;

    const diffMinutes = eventMinutes - currentMinutes;

    // Trigger notification if event is in 15 minutes and hasn't been notified yet
    if (diffMinutes > 0 && diffMinutes <= 30) {
      const key = `${m.id}-${m.dateStr}-${m.time}`;
      if (!notifiedMissions.has(key)) {
        notifiedMissions.add(key);
        const title = lang === 'id' ? `⏰ Reminder Agenda: ${m.title}` : `⏰ Agenda Reminder: ${m.title}`;
        const body = lang === 'id'
          ? `Mulai ${diffMinutes} menit lagi (${m.time}) ${m.location ? `@ ${m.location}` : ''}`
          : `Starting in ${diffMinutes} mins (${m.time}) ${m.location ? `@ ${m.location}` : ''}`;
        sendLocalNotification(title, body);
      }
    }
  });
};
