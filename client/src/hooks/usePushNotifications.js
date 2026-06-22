import { useState, useEffect } from 'react';

const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState(Notification?.permission || 'default');
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
    }
  }, []);

  const register = async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.register('/notification-sw.js');
        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY || null
        });
        setSubscription(sub);
        return sub;
      }
    } catch (error) {
      console.error('Push notification registration failed:', error);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Spin-to-Dine', {
        body: 'Notifications are working!',
        icon: '/logo192.png'
      });
    }
  };

  return { isSupported, permission, subscription, register, sendTestNotification };
};

export default usePushNotifications;
