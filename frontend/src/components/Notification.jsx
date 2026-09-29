import React from 'react';
import { useShop } from '../context/ShopContext';

export default function Notification() {
  const { notification } = useShop();
  if (!notification) return null;
  const icons = { success:'✓', info:'ℹ', warning:'⚠', error:'✕' };
  return (
    <div className={`toast ${notification.type}`}>
      <span>{icons[notification.type] || '•'}</span>
      <span>{notification.msg}</span>
    </div>
  );
}
