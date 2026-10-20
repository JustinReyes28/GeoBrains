'use client';
import { useMemo, useSyncExternalStore } from 'react';
import { PROGRESS_KEY, readProgress } from './progress';
const subscribe = (notify: () => void) => { window.addEventListener('storage', notify); window.addEventListener('geobrains-progress', notify); return () => { window.removeEventListener('storage', notify); window.removeEventListener('geobrains-progress', notify); }; };
const snapshot = () => {
    try {
        return localStorage.getItem(PROGRESS_KEY) ?? '[]';
    }
    catch {
        return '[]';
    }
};
const serverSnapshot = () => '[]';
export function useProgress() { const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot); return useMemo(() => readProgress({ getItem: () => raw }), [raw]); }
