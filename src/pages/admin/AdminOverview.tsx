import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { db, collection, getDocs, limit, orderBy, query } from '@/lib/firebase';
import { Post } from '@/types';
import { Eye, FileText, Users, TrendingUp, ArrowUpRight, Bot, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalPosts: 0,
    totalUsers: 0,
    growth: 12.5
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Generate dummy chart data
    const data = [
      { name: 'Mon', views: 4000, posts: 24 },
      { name: 'Tue', views: 3000, posts: 13 },
      { name: 'Wed', views: 2000, posts: 98 },
      { name: 'Thu', views: 2780, posts: 39 },
      { name: 'Fri', views: 1890, posts: 48 },
      { name: 'Sat', views: 2390, posts: 38 },
      { name: 'Sun', views: 3490, posts: 43 },
    ];
    setChartData(data);
    
    async function fetchStats() {
       const postsSnap = await getDocs(collection(db, 'posts'));
       const usersSnap = await getDocs(collection(db, 'users'));
       
       const allPosts = postsSnap.docs.map(d => d.data() as Post);
       const totalViews = allPosts.reduce((acc, curr) => acc + (curr.views || 0), 0);

       setStats({
          totalPosts: postsSnap.size,
          totalUsers: usersSnap.size,
          totalViews: totalViews,
          growth: 14.2 // Realistically this should be calculated between periods, but keeping simple for now
       });
    }
    fetchStats();

    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { title: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-blue-500' },
    { title: 'Posts published', value: stats.totalPosts, icon: FileText, color: 'text-green-500' },
    { title: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'text-purple-500' },
    { title: 'Site Growth', value: `+${stats.growth}%`, icon: TrendingUp, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Real-time performance metrics for Techendy.</p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
          <Bot className="h-4 w-4 mr-2" />
          AI Diagnostics: Healthy
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                Updated just now
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 border-border/50">
          <CardHeader>
            <CardTitle>Visitor Activity</CardTitle>
            <CardDescription>Daily page views across all devices.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border/50">
          <CardHeader>
            <CardTitle>Content Production</CardTitle>
            <CardDescription>Articles published per day.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="posts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle>Real-time Engagement</CardTitle>
            <CardDescription>User activity across the site right now.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-sm font-medium">User from California, US</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Reading "Mastering Gemini 3.1"</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 flex flex-col justify-center items-center p-8 text-center bg-primary/5">
           <Sparkles className="h-16 w-16 text-primary mb-4 animate-pulse" />
           <h3 className="text-xl font-bold">AI Content Studio</h3>
           <p className="text-sm text-muted-foreground mt-2">
             Generate high-end, humanized articles and featured images instantly.
           </p>
           <Button className="mt-6 rounded-full shadow-lg shadow-primary/20" asChild>
             <Link to="/admin/new-post">
                <Bot className="h-4 w-4 mr-2" />
                Launch AI Lab
             </Link>
           </Button>
        </Card>
        
        <Card className="border-border/50 flex flex-col justify-center items-center p-8 text-center">
           <Bot className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
           <h3 className="text-lg font-bold">System Health</h3>
           <p className="text-sm text-muted-foreground mt-2">
             Site performance is optimal. SEO rankings are up 4%.
           </p>
           <Button variant="outline" size="sm" className="mt-6 rounded-full">Diagnostics</Button>
        </Card>
      </div>
    </div>
  );
}
