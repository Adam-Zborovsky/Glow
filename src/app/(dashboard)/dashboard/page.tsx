import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Eye, 
  ExternalLink, 
  MoreHorizontal, 
  Plus, 
  TrendingUp, 
  MousePointer2, 
  Users,
  Edit,
  Trash2,
  CopyPlus,
} from "lucide-react";
import Link from "next/link";
import { getPages, createPage } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { PageCardDropdown } from "@/components/dashboard/page-card-dropdown";

export default async function DashboardPage() {
  const session = await auth();
  const pages = await getPages();
  const username = (session?.user as any)?.username;

  const stats = [
    { label: "Page Views", value: pages.reduce((acc, p) => acc + (p as any)._count.views, 0).toLocaleString(), trend: "+12%", icon: Eye },
    { label: "Link Clicks", value: "384", trend: "+5.2%", icon: MousePointer2 },
    { label: "Click Rate", value: "30.8%", trend: "+2.4%", icon: TrendingUp },
    { label: "New Subscribers", value: "12", trend: "+1%", icon: Users },
  ];

  return (
    <main className="max-w-7xl mx-auto pt-12 pb-24 px-6">
      {/* Welcome Section */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Good morning, {session?.user?.name?.split(' ')[0]}</h1>
        <div className="flex items-center gap-2 text-primary font-mono text-sm font-medium group cursor-pointer w-fit">
          <span>glow.page/{(session?.user as any)?.username}</span>
          <button className="p-1 hover:bg-primary/10 rounded transition-colors text-slate-400 group-hover:text-primary">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
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
      </section>

      {/* Pages Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Pages</h2>
          <form action={createPage}>
            <Button type="submit" className="primary-gradient text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 border-none h-auto">
              <Plus className="w-5 h-5" />
              <span>Create New Page</span>
            </Button>
          </form>
        </div>

        {/* Page Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div key={page.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm group hover:border-primary/30 transition-all">
              {/* Preview Area */}
              <div className="h-[200px] bg-slate-100 overflow-hidden relative text-center flex items-center justify-center">
                <div className="absolute inset-0 primary-gradient opacity-10" />
                <span className="text-slate-400 text-xs font-medium z-10 uppercase tracking-widest">{page.title}</span>
                {/* Edit Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px] z-20">
                   <Button asChild className="bg-white text-slate-900 hover:bg-slate-50 font-bold px-6 rounded-xl border-none">
                      <Link href={`/editor/${page.id}`}>Edit Page</Link>
                   </Button>
                </div>
              </div>
              
              {/* Info Area */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 tracking-tight">{page.title}</h3>
                    {page.published ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] tracking-widest px-2 py-0.5 uppercase flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Live
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[10px] tracking-widest px-2 py-0.5 uppercase">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <PageCardDropdown 
                    pageId={page.id} 
                    slug={page.slug} 
                    username={username} 
                  />
                </div>
                
                <p className="font-mono text-xs text-slate-400">glow.page/{(session?.user as any)?.username}/{page.slug === 'main' ? '' : page.slug}</p>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-mono font-medium">{(page as any)._count.views}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MousePointer2 className="w-4 h-4" />
                      <span className="text-xs font-mono font-medium">0</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-primary hover:bg-primary/5 group" asChild>
                    <Link href={`/${(session?.user as any)?.username}`} target="_blank">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Create New Page Card */}
          <form action={createPage}>
            <button type="submit" className="w-full text-left border-2 border-dashed border-slate-200 rounded-xl h-full flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-primary/50 transition-all bg-white/50 hover:bg-white min-h-[300px]">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all mb-4">
                <Plus className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-900">Create New Page</p>
              <p className="text-slate-400 text-xs mt-1 text-center max-w-[180px]">Set up a portfolio, link-in-bio, or landing page.</p>
            </button>
          </form>
        </div>
      </section>
      
      {/* Dashboard Footer */}
      <footer className="mt-24 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
          <Link href="#" className="hover:text-primary transition-colors">Docs</Link>
          <Link href="#" className="hover:text-primary transition-colors">Community</Link>
          <Link href="#" className="hover:text-primary transition-colors">Support</Link>
          <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
        </div>
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
          © Glow Platform 2026 • Version 2.0.4-stable
        </div>
      </footer>
    </main>
  );
}
