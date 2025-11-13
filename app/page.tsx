'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useReservations } from '../modules/reservations/logic/useReservations';
import { useHousekeeping } from '../modules/housekeeping/logic/useHousekeeping';
import { useRooms } from '../modules/rooms/logic/useRooms';
import { FiCalendar, FiUsers, FiMessageSquare, FiHome } from 'react-icons/fi';
import { GiBroom } from 'react-icons/gi';
import { ComponentType } from 'react';

function MetricCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-dark">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <Icon className="text-2xl text-neutral-dark" />
      </div>
    </div>
  );
}

function RecentActivity({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="text-sm text-neutral-dark p-3 bg-neutral-light rounded-lg">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { reservations } = useReservations();
  const { tasks } = useHousekeeping();
  const { rooms } = useRooms();

  // Calculate metrics
  const { today } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    return { today: todayStr };
  }, []);

  const todaysArrivals = reservations?.filter(r => r.check_in === today).length || 0;
  const todaysDepartures = reservations?.filter(r => r.check_out === today).length || 0;
  const totalRooms = rooms?.length || 0;
  const occupiedRooms = rooms?.filter(r => r.status === 'occupied').length || 0;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;

  // Recent activities (mock data for now)
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  const weekAgo = useMemo(() => new Date(currentTime - 7 * 24 * 60 * 60 * 1000), [currentTime]);
  const recentArrivals = useMemo(() => {
    return reservations?.filter(r => r.check_in && new Date(r.check_in) >= weekAgo)
      .slice(0, 5)
      .map(r => `${r.guest_name} - Room ${r.room_number}`) || [];
  }, [reservations, weekAgo]);

  const pendingHousekeeping = tasks?.filter(t => t.status === 'pending')
    .slice(0, 5)
    .map(t => `Room ${t.room_number} - ${t.status}`) || [];

   return (
     <div className="space-y-8">
       <div>
         <h1 className="text-2xl font-semibold text-foreground mb-2">{t('dashboard.title')}</h1>
         <p className="text-neutral-dark">{t('dashboard.welcomeMessage')}</p>
       </div>

       {/* Key Metrics */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <MetricCard
           title={t('dashboard.todaysArrivals')}
           value={todaysArrivals}
           icon={FiUsers}
           color="border-primary"
         />
         <MetricCard
           title={t('dashboard.todaysDepartures')}
           value={todaysDepartures}
           icon={FiCalendar}
           color="border-cyan-400"
         />
         <MetricCard
           title={t('dashboard.occupancyRate')}
           value={`${occupancyRate}%`}
           icon={FiHome}
           color="border-emerald-400"
         />
         <MetricCard
           title={t('dashboard.pendingTasks')}
           value={pendingTasks}
           icon={GiBroom}
           color="border-amber-400"
         />
       </div>

       {/* Recent Activities and Gantt Preview */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <RecentActivity
           title={t('dashboard.recentArrivals')}
           items={recentArrivals.length > 0 ? recentArrivals : [t('dashboard.noRecentArrivals')]}
         />
         <RecentActivity
           title={t('dashboard.pendingHousekeeping')}
           items={pendingHousekeeping.length > 0 ? pendingHousekeeping : [t('dashboard.noPendingTasks')]}
         />
         <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
           <h3 className="text-lg font-semibold mb-4 text-foreground">{t('dashboard.roomOccupancyPreview')}</h3>
           <div className="overflow-x-auto">
             <div className="min-w-max">
               {/* Mini Gantt Header */}
               <div className="flex border-b border-gray-200 bg-gray-50">
                 <div className="w-16 p-2 text-xs font-semibold text-gray-600">{t('dashboard.room')}</div>
                 {Array.from({ length: 7 }, (_, i) => {
                   const date = new Date();
                   date.setDate(date.getDate() + i);
                   return (
                     <div key={i} className="w-6 p-2 text-xs text-center text-gray-600">
                       {date.getDate()}
                     </div>
                   );
                 })}
               </div>
               {/* Mini Gantt Rows */}
               {rooms?.slice(0, 5).map(room => (
                 <div key={room.id} className="flex border-b border-gray-100">
                   <div className="w-16 p-2 text-xs font-medium text-gray-800 bg-gray-50">
                      {room.room_number}
                   </div>
                   <div className="flex">
                     {Array.from({ length: 7 }, (_, i) => {
                       const date = new Date();
                       date.setDate(date.getDate() + i);
                       const dateStr = date.toISOString().split('T')[0];
                       const hasReservation = reservations?.some(r =>
                          r.room_number === room.room_number &&
                         r.check_in && r.check_out &&
                         dateStr >= r.check_in && dateStr < r.check_out
                       );
                       return (
                         <div
                           key={i}
                           className={`w-6 h-6 border-r border-gray-200 ${
                             hasReservation ? 'bg-blue-200' : room.status === 'occupied' ? 'bg-red-200' : 'bg-green-100'
                           }`}
                         ></div>
                       );
                     })}
                   </div>
                 </div>
               ))}
             </div>
           </div>
           <div className="mt-4 flex gap-4 text-xs">
             <span className="flex items-center">
               <div className="w-3 h-3 bg-primary/20 mr-2 rounded"></div>
               <span className="text-neutral-dark">{t('dashboard.reserved')}</span>
             </span>
             <span className="flex items-center">
               <div className="w-3 h-3 bg-red-200 mr-2 rounded"></div>
               <span className="text-neutral-dark">{t('dashboard.occupied')}</span>
             </span>
             <span className="flex items-center">
               <div className="w-3 h-3 bg-green-100 mr-2 rounded"></div>
               <span className="text-neutral-dark">{t('dashboard.available')}</span>
             </span>
           </div>
         </div>
       </div>

       {/* Quick Actions */}
       <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-medium">
         <h3 className="text-lg font-semibold mb-4 text-foreground">{t('dashboard.quickActions')}</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <button
             onClick={() => router.push('/modules/reservations')}
             className="bg-primary hover:bg-primary-dark text-white p-4 rounded-lg flex flex-col items-center transition-all duration-200 hover:shadow-md"
           >
             <FiCalendar className="text-xl mb-2" />
             <span className="text-sm font-medium">{t('dashboard.newReservation')}</span>
           </button>
           <button
             onClick={() => router.push('/modules/front-desk')}
             className="bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-lg flex flex-col items-center transition-all duration-200 hover:shadow-md"
           >
             <FiUsers className="text-xl mb-2" />
             <span className="text-sm font-medium">{t('dashboard.checkInGuest')}</span>
           </button>
           <button
             onClick={() => router.push('/modules/housekeeping')}
             className="bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-lg flex flex-col items-center transition-all duration-200 hover:shadow-md"
           >
             <GiBroom className="text-xl mb-2" />
             <span className="text-sm font-medium">{t('dashboard.housekeeping')}</span>
           </button>
           <button
             onClick={() => router.push('/modules/ai-concierge')}
             className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-lg flex flex-col items-center transition-all duration-200 hover:shadow-md"
           >
             <FiMessageSquare className="text-xl mb-2" />
             <span className="text-sm font-medium">{t('dashboard.messages')}</span>
           </button>
         </div>
       </div>
    </div>
  );
}
