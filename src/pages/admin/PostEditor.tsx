import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs,
  Timestamp, 
} from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bot, 
  Image as ImageIcon, 
  Save, 
  Eye, 
  ArrowLeft, 
  Sparkles, 
  Search as SearchIcon,
  Loader2,
  Layers
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'sonner';
import { Category } from '@/types';
import { generateArticleImage, getSEOInsights, generateFullArticle, generateArticleIntro } from '@/lib/gemini';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingSEO, setGeneratingSEO] = useState(false);
  const [generatingFull, setGeneratingFull] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [seoResult, setSeoResult] = useState<{ keywords?: { term: string, difficulty: string }[] } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft' as 'draft' | 'published',
    featuredImage: '',
    seoTitle: '',
    seoDescription: '',
    tags: [] as string[],
    categoryId: 'general',
    recommendedToolName: '',
    recommendedToolUrl: '',
    titleBgColor: '#000000',
    titleBgOpacity: 0.1,
  });

  const [uploading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();

    if (id) {
      async function fetchPost() {
        const snap = await getDoc(doc(db, 'posts', id!));
        if (snap.exists()) {
          setFormData(snap.data() as any);
        }
        setFetching(false);
      }
      fetchPost();
    }
  }, [id]);

  const handleUpdate = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    handleUpdate('slug', slug);
  };

  const handleFullAIGen = async () => {
    if (!aiTopic) {
      toast.error("Please enter a topic for the AI to write about");
      return;
    }
    setGeneratingFull(true);
    try {
      const result = await generateFullArticle(aiTopic);
      if (result) {
        setFormData(prev => ({
          ...prev,
          title: result.title || prev.title,
          content: result.content || prev.content,
          excerpt: result.excerpt || prev.excerpt,
          tags: result.tags || prev.tags,
          categoryId: result.categoryRecommendation || prev.categoryId
        }));
        
        // Auto-generate image if wanted
        toast.info("Article base generated. Now generating featured image...");
        const aiImage = await generateArticleImage(result.title);
        if (aiImage) {
          handleUpdate('featuredImage', aiImage);
        }
        
        // Finalize slug
        const slug = (result.title || formData.title)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        handleUpdate('slug', slug);

        toast.success("Full humanized article and image generated!");
      }
    } catch (error) {
      toast.error("Failed to generate article");
    } finally {
      setGeneratingFull(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.title) {
       toast.error("Please enter a title first");
       return;
    }
    setGeneratingImage(true);
    try {
      const aiImage = await generateArticleImage(formData.title);
      if (aiImage) {
        handleUpdate('featuredImage', aiImage);
        toast.success("Gemini Image URL applied!");
      } else {
        toast.error("Gemini failed to generate image. Try manual URL.");
      }
    } catch (error) {
      toast.error("Failed to generate image");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGeminiIntro = async () => {
    if (!formData.title) {
      toast.error("Enter a title first");
      return;
    }

    setLoading(true);
    try {
      const response = await generateArticleIntro(formData.title, formData.tags);
      if (response) {
        const currentContent = formData.content;
        handleUpdate('content', `${currentContent}<p>${response.replace(/\n/g, '<br>')}</p>`);
        toast.success("Gemini Content appended!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gemini error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!formData.content) {
       toast.error("Add some content first for analysis");
       return;
    }
    setGeneratingSEO(true);
    try {
      const insights = await getSEOInsights(formData.content);
      if (insights) {
        setSeoResult(insights);
        setFormData(prev => ({
          ...prev,
          seoTitle: insights.seoTitle || prev.seoTitle,
          seoDescription: insights.seoDescription || prev.seoDescription,
          tags: insights.tags || prev.tags
        }));
        toast.success("SEO Insights generated!");
      }
    } catch (error) {
      toast.error("Failed to generate SEO insights");
    } finally {
      setGeneratingSEO(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Title, Slug and Content are required");
      return;
    }

    setLoading(true);
    try {
      const postData = {
        ...formData,
        authorId: profile?.uid,
        authorName: profile?.displayName,
        updatedAt: Timestamp.now(),
        views: formData.status === 'published' ? (formData as any).views || 0 : 0
      };

      if (id) {
        await updateDoc(doc(db, 'posts', id), postData);
        toast.success(formData.status === 'draft' ? "Draft updated!" : "Post updated!");
      } else {
        const newDocRef = doc(collection(db, 'posts'));
        await setDoc(newDocRef, {
          ...postData,
          createdAt: Timestamp.now(),
          views: 0
        });
        toast.success(formData.status === 'draft' ? "Draft saved!" : "Post published!");
        navigate('/admin/posts');
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const imageHandler = () => {
    const url = prompt("Enter the URL of the image you'd like to insert:");
    if (url) {
      const quill = (document.querySelector('.ql-container') as any).__quill;
      const range = quill.getSelection();
      quill.insertEmbed(range.index, 'image', url);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  };

  if (fetching) return <div className="p-20 text-center">Loading editor...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/posts"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? 'Edit Article' : 'Compose New Article'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              handleUpdate('status', 'draft');
              // Delay slightly to allow state to catch up, or better yet pass status directly
              setTimeout(() => handleSubmit({ preventDefault: () => {} } as any), 10);
            }}
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button 
            onClick={() => {
              handleUpdate('status', 'published');
              setTimeout(() => handleSubmit({ preventDefault: () => {} } as any), 10);
            }} 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {id ? 'Update Post' : 'Publish Article'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => handleUpdate('title', e.target.value)}
                  onBlur={handleCreateSlug}
                  placeholder="e.g. The Future of Gemini 3.1"
                  className="text-lg font-semibold py-6"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex gap-2">
                  <Input 
                    id="slug" 
                    value={formData.slug} 
                    onChange={(e) => handleUpdate('slug', e.target.value)}
                    placeholder="future-of-gemini-3-1"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleCreateSlug}>
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Body Content</Label>
                <div className="bg-background rounded-md border min-h-[400px]">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.content} 
                    onChange={(val) => handleUpdate('content', val)}
                    className="h-[350px] mb-12"
                    modules={modules}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Excerpt & Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={formData.excerpt} 
                onChange={(e) => handleUpdate('excerpt', e.target.value)}
                placeholder="A brief summary for card previews..."
                className="h-24 resize-none"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Article Lab
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label className="text-xs">Article Topic / Keyword</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input 
                    placeholder="e.g. Benefits of Gemini 3.1 for developers" 
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="bg-background flex-grow"
                  />
                  <div className="w-full sm:w-48">
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(val) => handleUpdate('categoryId', val)}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button 
                type="button" 
                className="w-full rounded-xl shadow-lg shadow-primary/20"
                onClick={handleFullAIGen}
                disabled={generatingFull}
              >
                {generatingFull ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Generate Human Article
              </Button>
              <p className="text-[10px] text-muted-foreground text-center italic">
                Generates title, content, SEO, tags & image in one click.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Toolset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                type="button"
                className="w-full justify-start rounded-xl" 
                variant="outline"
                onClick={handleGeminiIntro}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Gemini Intro Assistant
              </Button>
              <Button 
                type="button"
                className="w-full justify-start rounded-xl" 
                variant="outline"
                onClick={handleGenerateImage}
                disabled={generatingImage}
              >
                {generatingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                Generate Related Image
              </Button>
              <Button 
                type="button"
                className="w-full justify-start rounded-xl" 
                variant="outline"
                onClick={handleGenerateSEO}
                disabled={generatingSEO}
              >
                {generatingSEO ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
                Optimize SEO / Keywords
              </Button>

              {seoResult?.keywords && (
                <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">30 Trending Keywords</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[8px] uppercase font-bold"
                      onClick={() => {
                        const newTags = [...new Set([...formData.tags, ...seoResult.keywords!.map(k => k.term.toLowerCase())])];
                        handleUpdate('tags', newTags.slice(0, 20)); // Limit to 20 tags
                        toast.success("Keywords added to article tags!");
                      }}
                    >
                      Apply All
                    </Button>
                  </div>
                  <div className="max-h-[250px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {seoResult.keywords.map((kw, i) => (
                      <div key={i} className="flex items-center justify-between text-xs group hover:bg-white p-1 rounded transition-colors">
                        <span className="font-semibold text-stone-700">{kw.term}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-[8px] font-bold uppercase ${
                            kw.difficulty === 'Low' ? 'text-green-600 border-green-200 bg-green-50' :
                            kw.difficulty === 'Medium' ? 'text-amber-600 border-amber-200 bg-amber-50' :
                            'text-red-600 border-red-200 bg-red-50'
                          }`}>
                            {kw.difficulty}
                          </Badge>
                          <button 
                            type="button"
                            onClick={() => {
                              if (!formData.tags.includes(kw.term.toLowerCase())) {
                                handleUpdate('tags', [...formData.tags, kw.term.toLowerCase()]);
                                toast.success(`Added "${kw.term}"`);
                              }
                            }}
                            className="hidden group-hover:block text-primary"
                          >
                            <Sparkles className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.featuredImage ? (
                <div className="relative group rounded-lg overflow-hidden border">
                  <img src={formData.featuredImage} alt="Preview" className="w-full aspect-video object-cover" />
                  <button 
                    type="button"
                    onClick={() => handleUpdate('featuredImage', '')}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                  <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-xs mb-3">No featured graphic selected</p>
                  <div className="w-full">
                    <Input 
                        className="text-xs h-8 bg-background" 
                        placeholder="Paste image URL here..." 
                        onBlur={(e) => handleUpdate('featuredImage', (e.target as HTMLInputElement).value)}
                        onChange={(e) => handleUpdate('featuredImage', e.target.value)}
                        value={formData.featuredImage}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Article Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Category</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(val) => handleUpdate('categoryId', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="general">General Archive</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Title Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color"
                    value={formData.titleBgColor || '#000000'} 
                    onChange={(e) => handleUpdate('titleBgColor', e.target.value)}
                    className="h-10 w-20 p-1"
                  />
                  <Input 
                    value={formData.titleBgColor || '#000000'} 
                    onChange={(e) => handleUpdate('titleBgColor', e.target.value)}
                    placeholder="#000000"
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Background Opacity ({Math.round((formData.titleBgOpacity || 0) * 100)}%)</Label>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.titleBgOpacity || 0}
                  onChange={(e) => handleUpdate('titleBgOpacity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                Adds a semi-transparent backing to the title in the detail view for better readability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Tool Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tool Name</Label>
                <Input 
                  value={formData.recommendedToolName || ''} 
                  onChange={(e) => handleUpdate('recommendedToolName', e.target.value)}
                  placeholder="e.g. Gemini 2.0 Flash"
                />
              </div>
              <div className="space-y-2">
                <Label>Tool URL</Label>
                <Input 
                  value={formData.recommendedToolUrl || ''} 
                  onChange={(e) => handleUpdate('recommendedToolUrl', e.target.value)}
                  placeholder="e.g. https://deepmind.google/technologies/gemini/"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">SEO Title</Label>
                <Input 
                   value={formData.seoTitle} 
                   onChange={(e) => handleUpdate('seoTitle', e.target.value)}
                   className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">SEO Description</Label>
                <Textarea 
                   value={formData.seoDescription} 
                   onChange={(e) => handleUpdate('seoDescription', e.target.value)}
                   className="text-sm h-20 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Tags (comma separated)</Label>
                <Input 
                   value={formData.tags.join(', ')} 
                   onChange={(e) => handleUpdate('tags', e.target.value.split(',').map(t => t.trim()))}
                   className="h-8 text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
