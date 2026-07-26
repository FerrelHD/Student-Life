import React from 'react';
import { LanguageType, NotificationItem } from '../types';
import { getTranslation } from '../utils/i18n';
import { useEscapeClose } from '../utils/useEscapeClose';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  language?: LanguageType;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  language = 'id',
}) => {
  const t = getTranslation(language);
  useEscapeClose(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" className="expressive-card expressive-card-onyx w-full max-w-md p-6 shadow-2xl relative text-white border border-white/10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#d1c4e9] text-[#1f1732] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </div>
            <div>
              <h3 className="font-jakarta font-black text-lg text-white">{t.notificationsTitle}</h3>
              <p className="font-jakarta text-xs text-[#d1c4e9] font-bold">
                {t.unreadUpdates.replace('{count}', String(notifications.filter((n) => !n.read).length))}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.closePanel}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Action: Mark all read */}
        <div className="flex justify-between items-center mb-3 text-xs font-jakarta font-bold">
          <span className="text-gray-400">{t.academicAlerts}</span>
          <button
            onClick={onMarkAllAsRead}
            className="text-[#d1c4e9] hover:underline cursor-pointer"
          >
            {t.markAllRead}
          </button>
        </div>

        {/* List */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {notifications.length === 0 && (
            <p className="text-center text-xs font-jakarta font-bold text-gray-400 py-10">{t.noNotifications}</p>
          )}
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.read
                  ? 'bg-white/5 border-white/5 opacity-70'
                  : 'bg-white/10 border-white/15 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#ece28c]">
                    {item.type === 'deadline'
                      ? 'alarm'
                      : item.type === 'streak'
                      ? 'local_fire_department'
                      : 'military_tech'}
                  </span>
                  <h4 className="font-jakarta font-black text-sm text-white">{item.title}</h4>
                </div>
                <span className="font-jakarta text-[11px] text-gray-400 font-semibold">{item.time}</span>
              </div>
              <p className="font-jakarta text-xs text-gray-300 font-bold pl-6">{item.message}</p>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="pt-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-black py-3 rounded-full text-sm transition-all cursor-pointer"
          >
            {t.closePanel}
          </button>
        </div>
      </div>
    </div>
  );
};
