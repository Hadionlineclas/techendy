import { useState, useEffect } from 'react';
import { db, collection, getDocs, query, orderBy, where, limit, startAfter } from '@/lib/firebase';
import { Post, Category } from '@/types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchPosts(true);
  }, [activeCategory]);

  async function fetchCategories() {
    const snap = await getDocs(collection(db, 'categories'));
    setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
  }

  async function fetchPosts(reset = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'posts'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE)
      );

      if (activeCategory !== 'all') {
        q = query(q, where('categoryId', '==', activeCategory));
      }

      if (!reset && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      
      if (reset) {
        setPosts(data);
        setPage(1);
      } else {
        setPosts(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }

      setLastVisible(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <Helmet>
        <title>Blog | Techendy AI Insights</title>
        <meta name="description" content="Explore the latest articles, tutorials, and reviews of AI tools on the Techendy blog." />
      </Helmet>

      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="outline" className="mb-4">The Archive</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Expert AI Insights</h1>
          <p className="text-muted-foreground max-w-2xl">
            In-depth analysis of the tools shaping our digital future. From LLMs to Creative AI, stay informed with Techendy.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Button 
            variant={activeCategory === 'all' ? 'default' : 'outline'} 
            onClick={() => setActiveCategory('all')}
            className="rounded-full"
          >
            All Posts
          </Button>
          {categories.map(cat => (
            <Button 
              key={cat.id} 
              variant={activeCategory === cat.slug ? 'default' : 'outline'} 
              onClick={() => setActiveCategory(cat.slug)}
              className="rounded-full"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={`/blog/${post.slug}`}>
                <Card className="overflow-hidden h-full flex flex-col group border-border/50 hover:border-primary/50 transition-colors bg-card/50">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {post.featuredImage ? (
                      <img src={post.featuredImage} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10">
                        <Bot className="h-20 w-20" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                       <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{post.authorName}</Badge>
                       <span>•</span>
                       <span>{post.createdAt?.toDate?.() ? post.createdAt.toDate().toLocaleDateString() : 'Recent'}</span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3 break-words">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Button variant="link" className="px-0 p-0 h-auto text-primary">Read full story <ChevronRight className="h-4 w-4 ml-1" /></Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {loading && <div className="text-center py-10">Loading insights...</div>}
        
        {!loading && hasMore && (
          <div className="flex justify-center">
            <Button onClick={() => fetchPosts()} variant="outline" size="lg" className="rounded-full px-10">
              Load More Articles
            </Button>
          </div>
        )}

        {!loading && !hasMore && posts.length > 0 && (
          <p className="text-center text-muted-foreground italic">You've reached the end of the frontier.</p>
        )}
      </div>
    </div>
  );
}
