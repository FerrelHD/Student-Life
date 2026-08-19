import { Mission } from '../types';

const formatIcsDate = (dateStr: string, timeStr?: string): string => {
  const cleanDate = dateStr.replace(/-/g, '');
  if (!timeStr) return `${cleanDate}T090000Z`;

  const [hh, mm] = timeStr.split(':');
  const h = (hh || '09').padStart(2, '0');
  const m = (mm || '00').padStart(2, '0');
  return `${cleanDate}T${h}${m}00`;
};

export const downloadIcsFile = (mission: Mission) => {
  const dStr = mission.dateStr || new Date().toISOString().split('T')[0];
  const dtStart = formatIcsDate(dStr, mission.time);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Student Life//Agenda//EN',
    'BEGIN:VEVENT',
    `UID:${mission.id}@studentlife`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString().split('T')[0])}`,
    `DTSTART:${dtStart}`,
    `SUMMARY:${mission.title}`,
    `DESCRIPTION:Course: ${mission.course} | Priority: ${mission.priority}`,
    mission.location ? `LOCATION:${mission.location}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${mission.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getGoogleCalendarUrl = (mission: Mission): string => {
  const dStr = mission.dateStr || new Date().toISOString().split('T')[0];
  const dtStart = formatIcsDate(dStr, mission.time);

  const title = encodeURIComponent(mission.title);
  const details = encodeURIComponent(`Course: ${mission.course} | Priority: ${mission.priority}`);
  const location = encodeURIComponent(mission.location || '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dtStart}/${dtStart}&details=${details}&location=${location}`;
};
