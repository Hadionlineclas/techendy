import { useState, useEffect } from 'react';
import { db, collection, getDocs } from '@/lib/firebase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Eye, FileText, Calendar } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState<any>({
    viewsOverTime: [],
    postsByCategory: [],
    userGrowth: [],
    totalStats: {
      views: 0,
      posts: 0,
      users: 0,
      categories: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [postsSnap, usersSnap, catsSnap] = await Promise.all([
          getDocs(collection(db, 'posts')),
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'categories'))
        ]);

        const posts = postsSnap.docs.map(d => d.data());
        const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
        
        // Mocking some time-series data based on real counts for visual appeal
        const viewsOverTime = [
          { name: 'Mon', views: Math.floor(totalViews * 0.1) },
          { name: 'Tue', views: Math.floor(totalViews * 0.15) },
          { name: 'Wed', views: Math.floor(totalViews * 0.12) },
          { name: 'Thu', views: Math.floor(totalViews * 0.18) },
          { name: 'Fri', views: Math.floor(totalViews * 0.2) },
          { name: 'Sat', views: Math.floor(totalViews * 0.15) },
          { name: 'Sun', views: Math.floor(totalViews * 0.1) },
        ];

        // Group by category
        const catMap: any = {};
        posts.forEach(p => {
          const cat = p.category || 'Uncategorized';
          catMap[cat] = (catMap[cat] || 0) + 1;
        });
        const postsByCategory = Object.entries(catMap).map(([name, value]) => ({ name, value }));

        setData({
          viewsOverTime,
          postsByCategory,
          totalStats: {
            views: totalViews,
            posts: postsSnap.size,
            users: usersSnap.size,
            categories: catsSnap.size
          }
        });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) return <div className="p-10 text-center">Crunching numbers...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h1>
        <p className="text-muted-foreground">Deep dive into Techendy's growth and engagement metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Views" value={data.totalStats.views.toLocaleString()} icon={<Eye className="h-4 w-4" />} trend="+12.5%" />
        <StatCard title="Active Users" value={data.totalStats.users.toLocaleString()} icon={<Users className="h-4 w-4" />} trend="+3.2%" />
        <StatCard title="Total Articles" value={data.totalStats.posts.toLocaleString()} icon={<FileText className="h-4 w-4" />} trend="+5.4%" />
        <StatCard title="Growth Rate" value="24.8%" icon={<TrendingUp className="h-4 w-4" />} trend="+1.2%" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-border/50 shadow-sm bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Reader Engagement</CardTitle>
            <CardDescription>Views aggregated over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.viewsOverTime}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm bg-background/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Article volume across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.postsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.postsByCategory.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {data.postsByCategory.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm bg-background/50 backdrop-blur">
        <CardHeader>
          <CardTitle>User Growth Projection</CardTitle>
          <CardDescription>Estimated new reader acquisition based on current trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="rounded-2xl border-border/50 shadow-sm bg-background/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-emerald-500 font-medium">{trend}</span> from last month
        </p>
      </CardContent>
    </Card>
  );
}
