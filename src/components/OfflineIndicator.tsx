import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, AlertTriangle } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside aria-label="حالة الاتصال" className="fixed bottom-4 left-4 z-50 animate-bounce">
      <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2 text-xs font-bold text-white shadow-xl border border-amber-300">
        <WifiOff className="w-4 h-4 text-amber-200" />
        <span>وضع عدم الاتصال — يتم استعراض البيانات والأسئلة المحفوظة مؤقتاً</span>
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
      </div>
    </aside>
  );
};
