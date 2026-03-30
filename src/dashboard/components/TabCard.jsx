import React, { useState } from 'react';
import { ExternalLink, Trash2, Bell, Tag, Clock, MoreVertical, X } from 'lucide-react';
import useTabStore from '../../store/tabStore';
import TagBadge from '../../components/TagBadge';
import { TAG_OPTIONS, REMINDER_PRESETS } from '../../utils/constants';
import { extractDomain, timeAgo, getFaviconUrl, formatDate } from '../../utils/helpers';

export default function TabCard({ tab, index }) {
  const [showActions, setShowActions] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [customDateTime, setCustomDateTime] = useState('');
  const { updateTag, removeTab, setReminder, getReminderForTab } = useTabStore();

  const reminder = getReminderForTab(tab.id);

  const handleOpenTab = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: tab.url });
    } else {
      window.open(tab.url, '_blank');
    }
  };

  const handleTagSelect = async (tagId) => {
    await updateTag(tab.id, tagId === tab.tag ? null : tagId);
    setShowTagPicker(false);
  };

  const handleSetReminder = async (preset) => {
    if (preset.id === 'custom') return;
    await setReminder(tab.id, preset.getTime());
    setShowReminderPicker(false);
  };

  const handleCustomReminder = async () => {
    if (!customDateTime) return;
    const time = new Date(customDateTime).getTime();
    if (time <= Date.now()) return;
    await setReminder(tab.id, time);
    setShowReminderPicker(false);
    setCustomDateTime('');
  };

  return (
    <div 
      className={`glass-card rounded-xl p-4 group animate-fade-in relative ${showTagPicker || showReminderPicker ? 'z-50' : 'z-10'}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Favicon */}
        <div className="w-10 h-10 rounded-lg bg-surface-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img 
            src={tab.favicon || getFaviconUrl(tab.url)}
            alt=""
            className="w-6 h-6 rounded"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span class="text-xs text-surface-400">🌐</span>';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 
            className="text-sm font-semibold text-surface-100 truncate cursor-pointer
                      hover:text-primary-300 transition-colors"
            onClick={handleOpenTab}
            title={tab.title}
          >
            {tab.title}
          </h3>
          <p className="text-xs text-surface-400 truncate mt-0.5">{extractDomain(tab.url)}</p>
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {tab.tag && (
              <TagBadge 
                tag={tab.tag} 
                removable 
                onRemove={() => updateTag(tab.id, null)} 
              />
            )}
            {reminder && (
              <span className="tag-badge bg-amber-500/15 text-amber-300 border border-amber-500/25 text-[10px]">
                <Bell size={10} />
                {formatDate(reminder.remindAt)}
              </span>
            )}
            <span className="text-[10px] text-surface-500 flex items-center gap-1">
              <Clock size={10} />
              {timeAgo(tab.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => { setShowTagPicker(!showTagPicker); setShowReminderPicker(false); }}
            className="p-2 rounded-lg hover:bg-surface-700/50 text-surface-400 hover:text-primary-400 transition-colors"
            title="Tag"
          >
            <Tag size={14} />
          </button>
          <button
            onClick={() => { setShowReminderPicker(!showReminderPicker); setShowTagPicker(false); }}
            className="p-2 rounded-lg hover:bg-surface-700/50 text-surface-400 hover:text-amber-400 transition-colors"
            title="Set Reminder"
          >
            <Bell size={14} />
          </button>
          <button
            onClick={handleOpenTab}
            className="p-2 rounded-lg hover:bg-surface-700/50 text-surface-400 hover:text-cyan-400 transition-colors"
            title="Open Tab"
          >
            <ExternalLink size={14} />
          </button>
          <button
            onClick={() => removeTab(tab.id)}
            className="p-2 rounded-lg hover:bg-red-500/20 text-surface-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Tag Picker Dropdown */}
      {showTagPicker && (
        <div className="absolute right-4 top-14 z-50 glass rounded-xl p-2 min-w-[160px] 
                      animate-scale-in shadow-xl shadow-black/40">
          <div className="flex items-center justify-between px-2 pb-1 mb-1 border-b border-surface-700/50">
            <span className="text-xs text-surface-400 font-medium">Select Tag</span>
            <button onClick={() => setShowTagPicker(false)} className="text-surface-500 hover:text-surface-300">
              <X size={12} />
            </button>
          </div>
          {TAG_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleTagSelect(option.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium
                        transition-colors flex items-center gap-2
                        ${tab.tag === option.id 
                          ? 'bg-primary-500/20 text-primary-300' 
                          : 'hover:bg-surface-700/50 text-surface-300'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Reminder Picker Dropdown */}
      {showReminderPicker && (
        <div className="absolute right-4 top-14 z-50 glass rounded-xl p-2 min-w-[200px] 
                      animate-scale-in shadow-xl shadow-black/40">
          <div className="flex items-center justify-between px-2 pb-1 mb-1 border-b border-surface-700/50">
            <span className="text-xs text-surface-400 font-medium">Set Reminder</span>
            <button onClick={() => setShowReminderPicker(false)} className="text-surface-500 hover:text-surface-300">
              <X size={12} />
            </button>
          </div>
          {REMINDER_PRESETS.filter(p => p.id !== 'custom').map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSetReminder(preset)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium
                        hover:bg-surface-700/50 text-surface-300 transition-colors
                        flex items-center gap-2"
            >
              <span>{preset.icon}</span>
              {preset.label}
            </button>
          ))}
          <div className="mt-1 pt-1 border-t border-surface-700/50 space-y-1.5 p-1">
            <input 
              type="datetime-local"
              value={customDateTime}
              onChange={(e) => setCustomDateTime(e.target.value)}
              className="input-field text-xs"
            />
            <button
              onClick={handleCustomReminder}
              disabled={!customDateTime}
              className="btn-primary w-full text-xs py-1.5"
            >
              Set Custom
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
