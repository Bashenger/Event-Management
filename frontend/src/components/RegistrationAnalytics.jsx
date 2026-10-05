import React, { useMemo } from 'react';
import {
  Users,
  Calendar,
  Percent,
  TrendingUp,
  BarChart2,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';

export const RegistrationAnalytics = () => {
  const { events } = useEvents();

  const analytics = useMemo(() => {
    if (!Array.isArray(events) || events.length === 0) {
      return {
        totalEvents: 0,
        totalCapacity: 0,
        totalRegistered: 0,
        totalAvailable: 0,
        fillRate: 0,
        typeBreakdown: [],
        statusBreakdown: {},
      };
    }

    let totalCapacity = 0;
    let totalAvailable = 0;
    const typeMap = {};
    const statusMap = {};

    events.forEach((event) => {
      const max = Number(event.maxParticipants) || 0;
      const avail = Number(event.availableSeats) || 0;
      const registered = Math.max(0, max - avail);

      totalCapacity += max;
      totalAvailable += avail;

      const type = event.eventType || 'Other';
      if (!typeMap[type]) {
        typeMap[type] = { count: 0, capacity: 0, registered: 0 };
      }
      typeMap[type].count += 1;
      typeMap[type].capacity += max;
      typeMap[type].registered += registered;

      const status = event.status || 'Draft';
      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    const totalRegistered = totalCapacity - totalAvailable;
    const fillRate =
      totalCapacity > 0 ? Number(((totalRegistered / totalCapacity) * 100).toFixed(1)) : 0;

    const typeBreakdown = Object.entries(typeMap).map(([type, data]) => ({
      type,
      count: data.count,
      capacity: data.capacity,
      registered: data.registered,
      fillRate: data.capacity > 0 ? Math.round((data.registered / data.capacity) * 100) : 0,
    }));

    return {
      totalEvents: events.length,
      totalCapacity,
      totalRegistered,
      totalAvailable,
      fillRate,
      typeBreakdown,
      statusBreakdown: statusMap,
    };
  }, [events]);

  const maxTypeCapacity = Math.max(1, ...analytics.typeBreakdown.map((t) => t.capacity));

  return (
    <div className="space-y-6">
      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="p-5 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sunset-mutedLight dark:text-sunset-mutedDark">Total Events</span>
            <div className="w-8 h-8 rounded-xl bg-sunset-crimson/10 dark:bg-sunset-coral/15 flex items-center justify-center text-sunset-crimson dark:text-sunset-coral">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-black text-sunset-charcoal dark:text-white">{analytics.totalEvents}</p>
          <p className="text-[11px] text-sunset-mutedLight dark:text-sunset-mutedDark">Published & Upcoming</p>
        </div>

        {/* Total Attendees */}
        <div className="p-5 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sunset-mutedLight dark:text-sunset-mutedDark">Total Registered</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{analytics.totalRegistered}</p>
          <p className="text-[11px] text-sunset-mutedLight dark:text-sunset-mutedDark">of {analytics.totalCapacity} total seats</p>
        </div>

        {/* Overall Fill Rate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sunset-mutedLight dark:text-sunset-mutedDark">Campus Fill Rate</span>
            <div className="w-8 h-8 rounded-xl bg-sunset-tangerine/15 flex items-center justify-center text-sunset-tangerine dark:text-sunset-goldenTangerine">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-black text-sunset-tangerine dark:text-sunset-goldenTangerine">{analytics.fillRate}%</p>
          <p className="text-[11px] text-sunset-mutedLight dark:text-sunset-mutedDark">Average seat occupancy</p>
        </div>

        {/* Available Seats */}
        <div className="p-5 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sunset-mutedLight dark:text-sunset-mutedDark">Seats Open</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-black text-sunset-charcoal dark:text-white">{analytics.totalAvailable}</p>
          <p className="text-[11px] text-sunset-mutedLight dark:text-sunset-mutedDark">Available across all events</p>
        </div>
      </div>

      {/* Breakdown by Event Type Custom Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-sunset-slateDark border border-sunset-borderLight dark:border-sunset-borderDark space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-black text-sunset-charcoal dark:text-white uppercase flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sunset-crimson dark:text-sunset-coral" />
              Event Category Distribution & Fill Rates
            </h3>
            <p className="text-xs text-sunset-mutedLight dark:text-sunset-mutedDark">Breakdown of attendees and capacity by format</p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {analytics.typeBreakdown.map((item) => {
            const fillWidth = Math.min(100, item.fillRate);

            return (
              <div key={item.type} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sunset-charcoal dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sunset-crimson dark:bg-sunset-coral" />
                    {item.type} <span className="text-sunset-mutedLight dark:text-sunset-mutedDark font-normal">({item.count} events)</span>
                  </span>
                  <span className="font-mono text-sunset-mutedLight dark:text-sunset-mutedDark">
                    <span className="text-sunset-crimson dark:text-sunset-coral font-bold">{item.registered}</span> / {item.capacity} seats ({item.fillRate}%)
                  </span>
                </div>

                <div className="w-full h-3 bg-stone-100 dark:bg-sunset-obsidian rounded-full overflow-hidden p-0.5 border border-sunset-borderLight dark:border-sunset-borderDark flex">
                  <div
                    className="h-full bg-gradient-to-r from-sunset-crimson to-sunset-tangerine dark:from-sunset-coral dark:to-sunset-goldenTangerine rounded-full transition-all duration-700 shadow-sm"
                    style={{ width: `${fillWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
