import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    Activity,
    CalendarDays,
    Clock,
    ListChecks,
    Timer,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    getDurationStats,
    getInsightsSummary,
    getMeetingFrequency,
    getRecentMeetings,
    getTopParticipants,
} from '../utils/analyticsHelpers';

const AnalyticsPage = ({ meetings = [], darkMode = false }) => {
    const recentMeetings = useMemo(() => getRecentMeetings(meetings), [meetings]);
    const frequencyData = useMemo(() => getMeetingFrequency(meetings), [meetings]);
    const durationStats = useMemo(() => getDurationStats(recentMeetings), [recentMeetings]);
    const topParticipants = useMemo(() => getTopParticipants(meetings), [meetings]);
    const summary = useMemo(() => getInsightsSummary(meetings), [meetings]);

    const chartTheme = {
        axis: darkMode ? '#9ca3af' : '#6b7280',
        grid: darkMode ? '#374151' : '#e5e7eb',
        tooltipBg: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        tooltipBorder: darkMode ? '#374151' : '#e5e7eb',
        tooltipText: darkMode ? '#f9fafb' : '#111827',
        muted: darkMode ? '#d1d5db' : '#4b5563',
    };

    if (meetings.length === 0) {
        return (
            <div className="flex-1 w-full h-full overflow-y-auto bg-transparent transition-colors duration-200">
                <div className="w-full max-w-5xl mx-auto px-6 py-12">
                    <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 p-10 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                            <Activity size={28} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">No meetings recorded yet</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Once meetings are captured, this dashboard will show frequency, duration, and action item patterns.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full h-full overflow-y-auto bg-transparent transition-colors duration-200">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                            <TrendingUp size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Meeting patterns from your dashboard activity.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <MetricCard
                        icon={CalendarDays}
                        label="Total meetings"
                        value={summary.totalMeetings}
                        detail={`${recentMeetings.length} in the last 30 days`}
                    />
                    <MetricCard
                        icon={Clock}
                        label="Avg duration"
                        value={summary.hasDurationData ? `${summary.averageDuration} min` : 'Not available'}
                        detail={summary.durationSourceDetail}
                    />
                    <MetricCard
                        icon={ListChecks}
                        label="Pending action items"
                        value={summary.pendingActionItems}
                        detail="Open items from all meetings"
                    />
                    <MetricCard
                        icon={Activity}
                        label="Completion rate"
                        value={summary.completionRate === null ? 'Not tracked' : `${summary.completionRate}%`}
                        detail="Based on persisted checklist state"
                    />
                </div>

                <ChartCard
                    title="Meeting Frequency"
                    subtitle="Daily meeting count over the last 30 days"
                >
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={frequencyData} margin={{ top: 12, right: 20, left: -12, bottom: 8 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                            <XAxis
                                dataKey="label"
                                stroke={chartTheme.axis}
                                tick={{ fill: chartTheme.axis, fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: chartTheme.grid }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                stroke={chartTheme.axis}
                                tick={{ fill: chartTheme.axis, fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: chartTheme.grid }}
                                allowDecimals={false}
                            />
                            <Tooltip content={<ChartTooltip theme={chartTheme} labelKey="fullDate" valueLabel="Meetings" />} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                name="Meetings"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 3, strokeWidth: 2, fill: '#ffffff' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        <ChartCard
                            title="Duration Distribution"
                            subtitle="Saved duration metadata is used before transcript estimates"
                        >
                            {durationStats.knownCount === 0 ? (
                                <EmptyChart message={recentMeetings.length === 0 ? 'No meetings in the last 30 days.' : 'No duration data available for this range.'} />
                            ) : (
                                <ResponsiveContainer width="100%" height={320}>
                                    <PieChart>
                                        <Pie
                                            data={durationStats.buckets}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={110}
                                            paddingAngle={3}
                                        >
                                            {durationStats.buckets.map((entry) => (
                                                <Cell key={entry.name} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<ChartTooltip theme={chartTheme} valueLabel="Meetings" />} />
                                        <Legend
                                            formatter={(value) => {
                                                const bucket = durationStats.buckets.find((item) => item.name === value);
                                                return <span className="text-sm text-gray-600 dark:text-gray-300">{bucket ? `${value} (${bucket.label})` : value}</span>;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </ChartCard>
                    </div>

                    <ChartCard title="Duration Stats" subtitle="Longest and shortest meetings">
                        <div className="grid gap-4">
                            <DurationCard
                                icon={Clock}
                                label="Average"
                                minutes={durationStats.average}
                                title="Last 30 days"
                            />
                            <DurationCard
                                icon={Timer}
                                label="Longest"
                                minutes={durationStats.longest?.minutes || 0}
                                title={getMeetingTitle(durationStats.longest?.meeting)}
                            />
                            <DurationCard
                                icon={Timer}
                                label="Shortest"
                                minutes={durationStats.shortest?.minutes || 0}
                                title={getMeetingTitle(durationStats.shortest?.meeting)}
                            />
                        </div>
                    </ChartCard>
                </div>

                <ChartCard
                    title="Top Participants"
                    subtitle="Most frequent action item owners across all meetings"
                >
                    {topParticipants.length === 0 ? (
                        <EmptyChart message="No action item owners found yet." />
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={topParticipants} layout="vertical" margin={{ top: 12, right: 20, left: 16, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} horizontal={false} />
                                <XAxis
                                    type="number"
                                    stroke={chartTheme.axis}
                                    tick={{ fill: chartTheme.axis, fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={{ stroke: chartTheme.grid }}
                                    allowDecimals={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={90}
                                    stroke={chartTheme.axis}
                                    tick={{ fill: chartTheme.axis, fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={{ stroke: chartTheme.grid }}
                                />
                                <Tooltip content={<ChartTooltip theme={chartTheme} valueLabel="Action items" />} />
                                <Bar dataKey="count" name="Action items" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>
            </div>
        </div>
    );
};

const MetricCard = ({ icon, label, value, detail }) => {
    const Icon = icon;

    return (
        <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white break-words">{value}</p>
                </div>
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <Icon size={20} />
                </div>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{detail}</p>
        </div>
    );
};

const ChartCard = ({ title, subtitle, children }) => (
    <section className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sm:p-6 shadow-sm">
        <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        <div className="min-h-[320px]">
            {children}
        </div>
    </section>
);

const DurationCard = ({ icon, label, minutes, title }) => {
    const Icon = icon;

    return (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-950/30 p-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                    <Icon size={20} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{minutes} min</p>
                </div>
            </div>
            <p className="mt-3 truncate text-sm text-gray-600 dark:text-gray-300" title={title}>
                {title}
            </p>
        </div>
    );
};

const EmptyChart = ({ message }) => (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-950/20">
        <div className="text-center">
            <Users className="mx-auto mb-3 text-gray-400" size={28} />
            <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    </div>
);

const ChartTooltip = ({ active, payload, theme, labelKey, valueLabel }) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    const label = labelKey ? data[labelKey] : data.name || data.label;

    return (
        <div
            className="rounded-xl px-3 py-2 text-sm shadow-xl"
            style={{
                backgroundColor: theme.tooltipBg,
                border: `1px solid ${theme.tooltipBorder}`,
                color: theme.tooltipText,
            }}
        >
            <p className="font-semibold">{label}</p>
            <p style={{ color: theme.muted }}>
                {valueLabel}: {payload[0].value}
            </p>
        </div>
    );
};

const getMeetingTitle = (meeting) => {
    if (!meeting) return 'No meetings in this range';
    return meeting.title || meeting.summary || 'Untitled Meeting';
};

export default AnalyticsPage;
