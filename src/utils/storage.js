import { STORAGE_KEYS } from './constants';

/**
 * Chrome storage wrapper with async/await support.
 * Falls back to localStorage for development outside extension context.
 */

const isExtension = typeof chrome !== 'undefined' && chrome.storage;

export async function getFromStorage(key) {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] ?? null);
      });
    });
  }
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setToStorage(key, value) {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage set error:', e);
  }
}

export async function removeFromStorage(key) {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.remove([key], resolve);
    });
  }
  localStorage.removeItem(key);
}

export async function clearAllStorage() {
  if (isExtension) {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  }
  localStorage.clear();
}

export async function getAllTabs() {
  const tabs = await getFromStorage(STORAGE_KEYS.TABS);
  return tabs || [];
}

export async function saveTabs(tabs) {
  await setToStorage(STORAGE_KEYS.TABS, tabs);
}

export async function getAllReminders() {
  const reminders = await getFromStorage(STORAGE_KEYS.REMINDERS);
  return reminders || [];
}

export async function saveReminders(reminders) {
  await setToStorage(STORAGE_KEYS.REMINDERS, reminders);
}

export async function getSettings() {
  const settings = await getFromStorage(STORAGE_KEYS.SETTINGS);
  return settings || { theme: 'dark', notifications: true };
}

export async function saveSettings(settings) {
  await setToStorage(STORAGE_KEYS.SETTINGS, settings);
}
