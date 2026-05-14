import { useState, useEffect } from 'react';
import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from '@/lib/firebase';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Trash2, Plus, Loader2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const snap = await getDocs(collection(db, 'categories'));
    setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await addDoc(collection(db, 'categories'), { name, slug });
      setName('');
      fetchCategories();
      toast.success('Category added');
    } catch (error) {
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!editingCategory || !editName) return;
    setLoading(true);
    try {
      const slug = editName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await updateDoc(doc(db, 'categories', editingCategory.id), { 
        name: editName, 
        slug 
      });
      setEditingCategory(null);
      fetchCategories();
      toast.success('Category updated');
    } catch (error) {
      toast.error('Failed to update category');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    await deleteDoc(doc(db, 'categories', id));
    fetchCategories();
    toast.success('Category deleted');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">Manage article grouping and organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. LLMs" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Category
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{cat.slug}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              setEditingCategory(cat);
                              setEditName(cat.name);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Category Name</Label>
                              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleUpdate} disabled={loading}>
                              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
