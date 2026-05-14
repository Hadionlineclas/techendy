import { useState, useEffect } from 'react';
import { db, collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc, Timestamp } from '@/lib/firebase';
import { Post } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, ExternalLink, Search, Eye, Send } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Post)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(post: Post) {
    try {
      await updateDoc(doc(db, 'posts', post.id), {
        status: 'published',
        updatedAt: Timestamp.now()
      });
      setPosts(posts.map(p => p.id === post.id ? { ...p, status: 'published' } : p));
      toast.success('Article published to the archive!');
    } catch (error) {
      toast.error('Failed to publish article');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter(p => p.id !== id));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  }

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Repository</h1>
          <p className="text-muted-foreground">Manage your articles, drafts and AI experiments.</p>
        </div>
        <Button asChild className="rounded-full px-6 bg-primary shadow-lg shadow-primary/25">
          <Link to="/admin/new-post">Create New Post</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-muted/50 p-1 rounded-full border border-border/50">
            <TabsTrigger value="all" className="rounded-full px-6">All Posts</TabsTrigger>
            <TabsTrigger value="published" className="rounded-full px-6">Published</TabsTrigger>
            <TabsTrigger value="draft" className="rounded-full px-6">Drafts</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-4 bg-background px-4 py-2 rounded-full border border-border/50 flex-1 md:max-w-xs shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search content..." 
              className="bg-transparent border-none focus:ring-0 outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <div className="border border-border/50 rounded-2xl bg-background overflow-x-auto shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="py-4">Article</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20">Syncing with cloud state...</TableCell></TableRow>
                ) : filteredPosts.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-20">No matching articles found.</TableCell></TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{post.title}</span>
                          <span className="text-xs text-muted-foreground font-normal">techendy.com/blog/{post.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={post.status === 'published' ? 'default' : 'secondary'}
                          className={cn(
                            "rounded-full px-3 py-0.5 text-[10px] uppercase font-bold tracking-wider",
                            post.status === 'published' ? "bg-green-500/10 text-green-600 border-green-200" : "bg-stone-500/10 text-stone-600 border-stone-200"
                          )}
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {post.views.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {post.createdAt?.toDate?.() ? post.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full h-9 w-9 hover:bg-stone-100 hover:text-stone-900 active:scale-95 transition-all"
                              aria-label="Manage post"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="p-2 w-52">
                            {post.status === 'draft' && (
                              <>
                                <DropdownMenuItem 
                                  className="rounded-lg cursor-pointer text-primary focus:text-primary font-bold py-2.5"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePublish(post);
                                  }}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Publish Now
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5">
                              <Link to={`/admin/edit-post/${post.id}`}>
                                <Edit className="h-4 w-4 mr-2 text-stone-500" />
                                Modify Content
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2.5">
                              <Link to={`/blog/${post.slug}`} target="_blank">
                                <ExternalLink className="h-4 w-4 mr-2 text-stone-500" />
                                Live Preview
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              variant="destructive"
                              className="rounded-lg cursor-pointer py-2.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(post.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Purge Article
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
