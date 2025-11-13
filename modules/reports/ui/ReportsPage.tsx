'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useReports } from '../logic/useReports';
import { useReservations } from '../../reservations/logic/useReservations';
import { useRooms } from '../../rooms/logic/useRooms';
import { useHousekeeping } from '../../housekeeping/logic/useHousekeeping';
import { useCurrency } from '@/core/hooks/useCurrency';

export function ReportsPage() {
  const { t } = useTranslation('common');
  const { reportData, isLoading } = useReports();
  const { reservations } = useReservations();
  const { rooms } = useRooms();
  const { tasks } = useHousekeeping();
  const { formatCurrency } = useCurrency();
  const [selectedReport, setSelectedReport] = useState<'overview' | 'maintenance' | 'guests' | 'stayovers' | 'housekeeping' | 'foreign-police'>('overview');

  // Add currency change listener for auto-refresh
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  
  useEffect(() => {
    const handleCurrencyChange = () => {
      window.location.reload();
    };
    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  // Mock data for reports
  const maintenanceIssues = rooms?.flatMap(room =>
    room.maintenance_notes.map(note => ({
      ...note,
      roomNumber: room.room_number,
      roomType: room.type
    }))
  ) || [];

  const checkedInGuests = reservations?.filter(r => r.status === 'checked_in') || [];
  
  const checkedOutGuests = reservations?.filter(r => r.status === 'checked_out') || [];
  const stayoverGuests = reservations?.filter(r =>
    r.status === 'checked_in' &&
    new Date(r.check_out!) <= new Date(currentTime + 24 * 60 * 60 * 1000) &&
    new Date(r.check_out!) > new Date()
  ) || [];

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">{t('reports.title')}</h1>
        <p className="text-neutral-dark">{t('reports.description')}</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedReport('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedReport === 'overview' ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium'
          }`}
        >
          {t('reports.overview')}
        </button>
        <button
          onClick={() => setSelectedReport('maintenance')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedReport === 'maintenance' ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium'
          }`}
        >
          {t('reports.maintenance')}
        </button>
        <button
          onClick={() => setSelectedReport('guests')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedReport === 'guests' ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium'
          }`}
        >
          {t('reports.guests')}
        </button>
        <button
          onClick={() => setSelectedReport('stayovers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedReport === 'stayovers' ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium'
          }`}
        >
          {t('reports.stayovers')}
        </button>
        <button
          onClick={() => setSelectedReport('housekeeping')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedReport === 'housekeeping' ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium'
          }`}
        >
          {t('reports.housekeeping')}
        </button>
        <button
          onClick={() => setSelectedReport('foreign-police')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedReport === 'foreign-police' ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium'
          }`}
        >
          {t('reports.foreignPolice')}
        </button>
      </div>
      {selectedReport === 'overview' && (
        <>
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-sm px-4 py-2"
            >
              {t('reports.print')}
            </button>
            <button
              onClick={() => {
                const summary = `${t('reports.hotelOverviewReport')}\n${t('reports.totalRevenueLabel')}: ${formatCurrency(reportData?.totalRevenue || 0)}\n${t('reports.occupancyRateLabel')}: ${reportData?.totalOccupancy}%\n${t('reports.totalGuestsLabel')}: ${reportData?.totalGuests}`;
                const blob = new Blob([summary], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = t('reports.overviewReport');
                a.click();
              }}
              className="btn-primary text-sm px-4 py-2"
            >
              {t('reports.exportSummary')}
            </button>
            <button
              onClick={() => {
                const message = t('reports.hotelOverview', { revenue: formatCurrency(reportData?.totalRevenue || 0), occupancy: reportData?.totalOccupancy, guests: reportData?.totalGuests });
                const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
              }}
              className="btn-success text-sm px-4 py-2"
            >
              {t('reports.share')}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-medium">
              <h2 className="text-lg font-semibold mb-2 text-foreground">{t('reports.totalRevenue')}</h2>
              <p className="text-3xl font-bold text-primary">{formatCurrency(reportData?.totalRevenue || 0)}</p>
              <p className="text-sm text-neutral-dark">{t('reports.thisMonth')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-medium">
              <h2 className="text-lg font-semibold mb-2 text-foreground">{t('reports.occupancyRate')}</h2>
              <p className="text-3xl font-bold text-emerald-600">{reportData?.totalOccupancy}%</p>
              <p className="text-sm text-neutral-dark">{t('reports.average')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-medium">
              <h2 className="text-lg font-semibold mb-2 text-foreground">{t('reports.totalGuests')}</h2>
              <p className="text-3xl font-bold text-amber-600">{reportData?.totalGuests}</p>
              <p className="text-sm text-neutral-dark">{t('reports.thisMonth')}</p>
            </div>
          </div>
          <div className="bg-neutral-light rounded-lg p-6 border border-neutral-medium">
            <h2 className="text-lg font-semibold mb-4 text-foreground">{t('reports.additionalMetrics')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-medium">
                <h3 className="font-semibold text-neutral-dark">{t('reports.averageStayDuration')}</h3>
                <p className="text-2xl font-bold text-primary">3.2 {t('reports.nights')}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-medium">
                <h3 className="font-semibold text-neutral-dark">{t('reports.cancellationRate')}</h3>
                <p className="text-2xl font-bold text-red-600">5.1%</p>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedReport === 'maintenance' && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t('reports.maintenanceIssues')}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-sm px-4 py-2"
              >
                {t('reports.print')}
              </button>
              <button
                onClick={() => {
                  const csv = maintenanceIssues.map(i =>
                    `${i.roomNumber},${i.note},${i.priority},${i.status},${i.date}`
                  ).join('\n');
                  const blob = new Blob([`${t('reports.roomIssuePriorityStatusDate')}\n${csv}`], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = t('reports.maintenanceReport');
                  a.click();
                }}
                className="btn-primary text-sm px-4 py-2"
              >
                {t('reports.exportCSV')}
              </button>
              <button
                onClick={() => {
                  const message = t('reports.maintenanceIssuesReport', { 
                    total: maintenanceIssues.length, 
                    open: maintenanceIssues.filter(i => i.status === 'open').length,
                    inProgress: maintenanceIssues.filter(i => i.status === 'in_progress').length 
                  });
                  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
                  window.open(url, '_blank');
                }}
                className="btn-success text-sm px-4 py-2"
              >
                {t('reports.share')}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="text-sm">
                <strong>{t('reports.totalIssues')}</strong> {maintenanceIssues.length}
              </div>
              <div className="text-sm">
                <strong>{t('reports.open')}</strong> {maintenanceIssues.filter(i => i.status === 'open').length}
              </div>
              <div className="text-sm">
                <strong>{t('reports.inProgress')}</strong> {maintenanceIssues.filter(i => i.status === 'in_progress').length}
              </div>
              <div className="text-sm">
                <strong>{t('reports.resolved')}</strong> {maintenanceIssues.filter(i => i.status === 'resolved').length}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-medium">
                    <th className="text-left p-2">{t('reports.room')}</th>
                    <th className="text-left p-2">{t('reports.issue')}</th>
                    <th className="text-left p-2">{t('reports.priority')}</th>
                    <th className="text-left p-2">{t('reports.status')}</th>
                    <th className="text-left p-2">{t('reports.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceIssues.map((issue) => (
                    <tr key={issue.id} className="border-b border-neutral-light">
                      <td className="p-2">{t('reports.roomNumber', { number: issue.roomNumber })}</td>
                       <td className="p-2">{issue.note}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          issue.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          issue.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          issue.status === 'open' ? 'bg-red-100 text-red-800' :
                          issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-2">{new Date(issue.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'guests' && (
        <div className="space-y-6">
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-sm px-4 py-2"
            >
              {t('reports.print')}
            </button>
            <button
              onClick={() => {
                const csv = [
                  t('reports.checkedInGuests'),
                  t('reports.nameRoomCheckinCheckout'),
                  ...checkedInGuests.map(g => `${g.guest_name},Room ${g.room_number},${new Date(g.check_in!).toLocaleDateString()},${new Date(g.check_out!).toLocaleDateString()}`),
                  '',
                  t('reports.checkedOutGuests'),
                  t('reports.nameRoomCheckout'),
                  ...checkedOutGuests.slice(0, 10).map(g => `${g.guest_name},Room ${g.room_number},${new Date(g.check_out!).toLocaleDateString()}`)
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = t('reports.guestsReportFile');
                a.click();
              }}
              className="btn-primary text-sm px-4 py-2"
            >
              {t('reports.exportCSV')}
            </button>
            <button
              onClick={() => {
                const message = t('reports.guestsReport', { checkedIn: checkedInGuests.length, checkedOut: checkedOutGuests.length });
                const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
              }}
              className="btn-success text-sm px-4 py-2"
            >
              {t('reports.share')}
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">{t('reports.currentlyCheckedIn')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-medium">
                    <th className="text-left p-2">{t('reports.guestName')}</th>
                    <th className="text-left p-2">{t('reports.room')}</th>
                    <th className="text-left p-2">{t('reports.checkin')}</th>
                    <th className="text-left p-2">{t('reports.checkout')}</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedInGuests.map((guest) => (
                    <tr key={guest.id} className="border-b border-neutral-light">
                      <td className="p-2">{guest.guest_name}</td>
                      <td className="p-2">Room {guest.room_number}</td>
                      <td className="p-2">{new Date(guest.check_in!).toLocaleDateString()}</td>
                      <td className="p-2">{new Date(guest.check_out!).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">{t('reports.recentlyCheckedOut')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-medium">
                    <th className="text-left p-2">{t('reports.guestName')}</th>
                    <th className="text-left p-2">{t('reports.room')}</th>
                    <th className="text-left p-2">{t('reports.checkOut')}</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedOutGuests.slice(0, 10).map((guest) => (
                    <tr key={guest.id} className="border-b border-neutral-light">
                      <td className="p-2">{guest.guest_name}</td>
                      <td className="p-2">Room {guest.room_number}</td>
                      <td className="p-2">{new Date(guest.check_out!).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'stayovers' && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t('reports.stayoversDescription')}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-sm px-4 py-2"
              >
                {t('reports.print')}
              </button>
              <button
                onClick={() => {
                  const csv = stayoverGuests.map(g =>
                    `${g.guest_name},Room ${g.room_number},${new Date(g.check_out!).toLocaleDateString()}`
                  ).join('\n');
                  const blob = new Blob([`${t('reports.nameRoomCheckout')}\n${csv}`], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = t('reports.stayoversReportFile');
                  a.click();
                }}
                className="btn-primary text-sm px-4 py-2"
              >
                {t('reports.exportCSV')}
              </button>
              <button
                onClick={() => {
                  const message = t('reports.stayoversReport', { 
                    stayovers: stayoverGuests.map(g => `Room ${g.room_number}: ${g.guest_name} - Departs ${new Date(g.check_out!).toLocaleDateString()}`).join('\n')
                  });
                  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
                  window.open(url, '_blank');
                }}
                className="btn-success text-sm px-4 py-2"
              >
                {t('reports.share')}
              </button>
            </div>
          </div>
          <p className="text-sm text-neutral-dark mb-4">{t('reports.roomsNeedAttention')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                  <tr className="border-b border-neutral-medium">
                    <th className="text-left p-2">{t('reports.guestName')}</th>
                    <th className="text-left p-2">{t('reports.room')}</th>
                    <th className="text-left p-2">{t('reports.checkOut')}</th>
                    <th className="text-left p-2">{t('reports.status')}</th>
                  </tr>
                </thead>
              <tbody>
                {stayoverGuests.map((guest) => (
                  <tr key={guest.id} className="border-b border-neutral-light">
                    <td className="p-2">{guest.guest_name}</td>
                    <td className="p-2">Room {guest.room_number}</td>
                    <td className="p-2">{new Date(guest.check_out!).toLocaleDateString()}</td>
                    <td className="p-2">
                       <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {t('reports.stayingOver')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedReport === 'housekeeping' && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t('reports.housekeepingTasks')}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-sm px-4 py-2"
              >
                {t('reports.print')}
              </button>
              <button
                onClick={() => {
                  const csv = pendingTasks.map(t =>
                    `${t.room_number},${t.status},${t.assigned_to}`
                  ).join('\n');
                  const blob = new Blob([`${t('reports.roomTaskAssignedTo')}\n${csv}`], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = t('reports.housekeepingReportFile');
                  a.click();
                }}
                className="btn-primary text-sm px-4 py-2"
              >
                {t('reports.exportCSV')}
              </button>
              <button
                onClick={() => {
                  const message = t('reports.housekeepingTasksReport', { 
                    pending: pendingTasks.length,
                    tasks: pendingTasks.map(t => `Room ${t.room_number}: ${t.status}`).join('\n')
                  });
                  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
                  window.open(url, '_blank');
                }}
                className="btn-success text-sm px-4 py-2"
              >
                {t('reports.share')}
              </button>
            </div>
          </div>
          <div className="space-y-4">
              <div className="text-sm">
                <strong>{t('reports.pendingTasks')}</strong> {pendingTasks.length}
              </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-medium">
                    <th className="text-left p-2">{t('reports.room')}</th>
                    <th className="text-left p-2">{t('reports.task')}</th>
                    <th className="text-left p-2">{t('reports.assignedTo')}</th>
                    <th className="text-left p-2">{t('reports.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTasks.map((task) => (
                    <tr key={task.id} className="border-b border-neutral-light">
                      <td className="p-2">Room {task.room_number}</td>
                      <td className="p-2">{task.status}</td>
                      <td className="p-2">{task.assigned_to}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                          {t('reports.pending')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'foreign-police' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">{t('reports.legalRequirement')}</h3>
            <p className="text-amber-700 text-sm">
              {t('reports.foreignPoliceDescription')}
            </p>
          </div>

          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => window.print()}
              className="btn-secondary text-sm px-4 py-2"
            >
              {t('reports.print')}
            </button>
            <button
              onClick={() => {
                const foreignGuests = checkedInGuests.filter(g => g.nationality !== 'CZ');
                const csv = [
                  t('reports.foreignPoliceReport'),
                  t('reports.namePassportNationalityRoomCheckin'),
                  ...foreignGuests.map(g => `${g.guest_name},${g.passport_number || 'N/A'},${g.nationality || 'N/A'},Room ${g.room_number},${new Date(g.check_in!).toLocaleDateString()}`)
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = t('reports.foreignPoliceReportFile');
                a.click();
              }}
              className="btn-primary text-sm px-4 py-2"
            >
              {t('reports.exportCSV')}
            </button>
            <button
              onClick={() => {
                const foreignGuests = checkedInGuests.filter(g => g.nationality !== 'CZ');
                const message = t('reports.foreignPoliceReportMessage', { 
                  count: foreignGuests.length,
                  date: new Date().toLocaleDateString()
                });
                const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(url, '_blank');
              }}
              className="btn-success text-sm px-4 py-2"
            >
              {t('reports.share')}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-medium p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">{t('reports.foreignGuestsCurrentlyStayed')}</h2>
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800">{t('reports.urgentReporting')}</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {checkedInGuests.filter(g => g.nationality !== 'CZ' && new Date(g.check_in!) >= new Date(currentTime - 24 * 60 * 60 * 1000)).length}
                  </p>
                  <p className="text-sm text-red-700">{t('reports.arrivedLast24Hours')}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800">{t('reports.totalForeignGuests')}</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {checkedInGuests.filter(g => g.nationality !== 'CZ').length}
                  </p>
                  <p className="text-sm text-blue-700">{t('reports.currentlyStayed')}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800">{t('reports.czechGuests')}</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {checkedInGuests.filter(g => g.nationality === 'CZ').length}
                  </p>
                  <p className="text-sm text-green-700">{t('reports.exemptFromReporting')}</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-medium">
                    <th className="text-left p-2">{t('reports.guestName')}</th>
                    <th className="text-left p-2">{t('reports.passportNumber')}</th>
                    <th className="text-left p-2">{t('reports.nationality')}</th>
                    <th className="text-left p-2">{t('reports.room')}</th>
                    <th className="text-left p-2">{t('reports.checkin')}</th>
                    <th className="text-left p-2">{t('reports.checkout')}</th>
                    <th className="text-left p-2">{t('reports.reportingStatus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedInGuests.filter(g => g.nationality !== 'CZ').map((guest) => {
                    const needsUrgentReporting = new Date(guest.check_in!) >= new Date(currentTime - 24 * 60 * 60 * 1000);
                    return (
                      <tr key={guest.id} className={`border-b border-neutral-light ${needsUrgentReporting ? 'bg-red-50' : ''}`}>
                        <td className="p-2 font-medium">{guest.guest_name}</td>
                        <td className="p-2">{guest.passport_number || 'N/A'}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            guest.nationality === 'CZ' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {guest.nationality || 'N/A'}
                          </span>
                        </td>
                        <td className="p-2">Room {guest.room_number}</td>
                        <td className="p-2">{new Date(guest.check_in!).toLocaleDateString()}</td>
                        <td className="p-2">{new Date(guest.check_out!).toLocaleDateString()}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            needsUrgentReporting ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {needsUrgentReporting ? t('reports.requiresImmediateReporting') : t('reports.reported')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}