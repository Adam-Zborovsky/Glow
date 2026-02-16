import { getAnalyticsSummary } from "@/lib/actions";
import { 
  TrendingUp, 
  MousePointer2, 
  Users, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalyticsPage() {
  const data = await getAnalyticsSummary();

  const stats = [
    { label: "Total Views", value: data.totalViews.toLocaleString(), trend: "+24%", icon: TrendingUp },
    { label: "Total Clicks", value: data.totalClicks.toLocaleString(), trend: "+18%", icon: MousePointer2 },
    { label: "Unique Visitors", value: "5,891", trend: "+21%", icon: Users },
    { label: "Click Rate", value: "25.6%", trend: "+3.2%", icon: MousePointer2 },
  ];

  return (
    <main className="max-w-7xl mx-auto pt-12 pb-24 px-6">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
          Last 30 Days
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-3 flex items-center justify-between">
              {stat.label}
              <stat.icon className="w-4 h-4 opacity-40" />
            </div>
            <div className="flex items-end justify-between">
              <div className="font-mono text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-emerald-500 text-xs font-bold mb-1 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Traffic Sources */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.topReferrers).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([ref, count]: any) => (
                <div key={ref} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[200px] md:max-w-md">
                      {ref === 'direct' ? 'Direct / Search' : ref.replace('https://', '').split('/')[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(count / data.totalViews) * 100}%` }} 
                      />
                    </div>
                    <span className="text-sm font-mono font-bold text-slate-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="border-slate-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 pt-2">
              {[
                { label: 'Mobile', key: 'MOBILE', icon: Smartphone, color: 'bg-violet-500' },
                { label: 'Desktop', key: 'DESKTOP', icon: Monitor, color: 'bg-blue-500' },
                { label: 'Tablet', key: 'TABLET', icon: Tablet, color: 'bg-emerald-500' },
              ].map((device) => {
                const count = data.viewsByDevice[device.key] || 0;
                const percentage = data.totalViews > 0 ? (count / data.totalViews) * 100 : 0;
                return (
                  <div key={device.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <device.icon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{device.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-1000", device.color)}
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
