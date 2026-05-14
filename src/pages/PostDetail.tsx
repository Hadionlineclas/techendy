import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc, getDocs, query, where, collection, onSnapshot, addDoc, Timestamp, orderBy, updateDoc, increment } from '@/lib/firebase';
import { Post, Comment, Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Share2, MessageSquare, Twitter, Linkedin, Facebook, Calendar, Clock, User as UserIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { AdUnit } from '@/components/ui/AdUnit';
import { Comments } from '@/components/blog/Comments';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const q = query(collection(db, 'posts'), where('slug', '==', slug), where('status', '==', 'published'));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const postDoc = snap.docs[0];
        const postData = { id: postDoc.id, ...postDoc.data() } as Post;
        setPost(postData);
        
        // Fetch category info
        if (postData.categoryId) {
          const catSnap = await getDoc(doc(db, 'categories', postData.categoryId));
          if (catSnap.exists()) {
            setCategory({ id: catSnap.id, ...catSnap.data() } as Category);
          }
        }
        
        // Increment views
        try {
          await updateDoc(doc(db, 'posts', postDoc.id), {
            views: increment(1)
          });
        } catch (error) {
          console.error("Failed to increment views:", error);
        }
      } else {
        setPost(null);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || 'Check this out on Techendy';
    let shareUrl = '';
    
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    
    window.open(shareUrl, '_blank');
  };

  if (loading) return <div className="p-20 text-center">Loading article...</div>;
  if (!post) return <div className="p-20 text-center">Post not found. <Link to="/blog" className="text-primary underline">Go back</Link></div>;

  return (
    <article className="min-h-screen bg-background">
      <Helmet>
        <title>{post.seoTitle || post.title} | Techendy</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
      </Helmet>

      {/* Elite Technical Archive Header */}
      <header className="relative pt-32 pb-24 bg-stone-950 border-b border-stone-800">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="flex-1 min-w-0">
              <div className="mb-10 flex flex-wrap items-center gap-4">
                {category && (
                  <Badge className="bg-white text-black hover:bg-stone-200 border-none text-[10px] font-bold uppercase tracking-[0.4em] px-5 py-2.5 rounded-none shadow-2xl">
                    {category.name}
                  </Badge>
                )}
                <div className="flex flex-wrap gap-3">
                  {post.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-stone-500 border-stone-800 text-[10px] uppercase font-bold tracking-widest bg-stone-900/40 px-3 py-1.5">
                      <span className="opacity-40 mr-1">#</span>{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] mb-12">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 py-8 border-y border-white/10">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-white/10 shadow-2xl">
                     <AvatarFallback className="bg-stone-900 text-white font-bold"><UserIcon className="h-7 w-7" /></AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-white font-black text-base tracking-tight leading-none mb-1">{post.authorName}</div>
                    <div className="text-[10px] uppercase font-black tracking-[0.3em] text-stone-500">Dispatch Lead</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden md:block" />
                <div className="flex items-center gap-3 text-stone-400 text-xs font-bold uppercase tracking-widest">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{post.createdAt?.toDate?.() ? post.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Verified Archive'}</span>
                </div>
                <div className="flex items-center gap-3 text-stone-400 text-xs font-bold uppercase tracking-widest">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>8m Deep Dive</span>
                </div>
              </div>
            </div>
            
            {/* Sidebar Placeholder for Perfect Alignment */}
            <div className="hidden lg:block w-80 shrink-0" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          <main className="w-full lg:flex-1 min-w-0">
            <div 
              className="prose prose-stone prose-lg md:prose-xl max-w-3xl 
                prose-headings:tracking-tighter prose-headings:font-black prose-headings:text-stone-950
                prose-p:text-stone-800 prose-p:leading-relaxed prose-p:font-medium prose-p:mb-10
                prose-a:text-black prose-a:font-bold prose-a:underline prose-a:underline-offset-4
                prose-blockquote:border-l-[6px] prose-blockquote:border-black prose-blockquote:bg-stone-50 prose-blockquote:py-6 prose-blockquote:px-10 prose-blockquote:rounded-none prose-blockquote:italic
                prose-img:rounded-none prose-img:shadow-2xl prose-img:border prose-img:border-stone-100
                prose-strong:text-stone-950 prose-strong:font-black
                break-normal overflow-wrap-normal"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="my-24 py-12 border-y border-stone-100">
              <AdUnit slot="article-mid-content" className="rounded-none border-stone-200 bg-stone-50" />
            </div>

            {/* Social Sharing & Engagement */}
            <div className="mt-16 pt-8 border-t border-stone-100 flex flex-wrap items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Share Dispatch:</span>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" onClick={() => handleShare('twitter')} className="hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleShare('linkedin')} className="hover:text-primary">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleShare('facebook')} className="hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-24">
              <Comments postId={post.id} />
            </div>

            {/* Techendy Information Block - Archive Style */}
            <div className="mt-24 p-12 bg-stone-50 border-t-4 border-black">
               <div className="flex items-center gap-3 mb-8">
                  <span className="h-0.5 w-10 bg-black"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-500">Archive Authenticity</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div>
                    <h3 className="text-4xl font-black tracking-tighter mb-8 leading-none">Generative <br/>Intelligence <br/>Discovery.</h3>
                    <p className="text-stone-600 text-sm leading-relaxed font-medium">
                      Techendy is the primary repository for analyzing synthetic tools and generative workflows. Every dispatch is curated to ensure high-density utility for next-generation intelligence discovery.
                    </p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="text-stone-500 text-sm leading-relaxed font-medium mb-12">
                      Our mission is strictly technical: we prioritize the dissemination of low-competition, high-value insights across the synthetic era.
                    </p>
                    <div className="flex flex-wrap items-center gap-8">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-none bg-black flex items-center justify-center text-white shadow-xl">
                            <Bot className="h-6 w-6" />
                         </div>
                         <div>
                            <div className="text-[9px] font-black uppercase tracking-[0.3em] leading-none mb-1">Support</div>
                            <a href="mailto:hadionlineclas@gmail.com" className="text-xs font-black hover:text-primary transition-colors">hadionlineclas@gmail.com</a>
                         </div>
                      </div>
                      <Button variant="outline" className="rounded-none border-stone-300 px-10 text-[10px] font-black uppercase tracking-[0.3em] h-14 hover:bg-black hover:text-white" asChild>
                         <Link to="/contact">Collaborate</Link>
                      </Button>
                    </div>
                  </div>
               </div>
            </div>
          </main>

          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24">
            <div className="space-y-12">
              <div className="p-10 bg-stone-950 text-white rounded-none border-t-8 border-primary shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Bot className="h-32 w-32 rotate-12" />
                 </div>
                 <h3 className="font-black mb-8 flex items-center gap-3 uppercase text-[10px] tracking-[0.5em] text-stone-500">
                   <Bot className="h-4 w-4 text-primary" />
                   AI UTILITY
                 </h3>
                 <p className="text-sm text-stone-300 mb-10 leading-relaxed font-medium relative z-10">
                   This dispatch identifies <strong>{post.recommendedToolName || 'Gemini 2.0 Flash'}</strong> as the optimal synthesis engine for these technical concepts.
                 </p>
                 <Button 
                   className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/95 font-black uppercase text-[10px] tracking-[0.3em] h-16 shadow-xl relative z-10 transition-all hover:scale-[1.02]" 
                   onClick={() => {
                     if (post.recommendedToolUrl) {
                       window.open(post.recommendedToolUrl, '_blank');
                     }
                   }}
                 >
                   Explore Research Tool
                 </Button>
              </div>
              
              <div className="pt-10 border-t-2 border-dotted border-stone-200">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400 mb-8 px-2">Network Protocol</div>
                <AdUnit slot="post-sidebar-bottom" format="rectangle" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
