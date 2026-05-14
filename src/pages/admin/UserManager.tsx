import { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, updateDoc, deleteDoc } from '@/lib/firebase';
import { UserProfile } from '@/types';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Shield, Trash2, UserCog, Search } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function UserManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => d.data() as UserProfile));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  const toggleAdmin = async (user: UserProfile) => {
     const newRole = user.role === 'admin' ? 'user' : 'admin';
     try {
       await updateDoc(doc(db, 'users', user.uid), { role: newRole });
       setUsers(users.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
       toast.success(`User set to ${newRole}`);
     } catch (error) {
       toast.error("Failed to update role");
     }
  };

  const deleteUserRecord = async (uid: string) => {
    if (!confirm("Are you sure? This only deletes their Firestore record, not Auth account.")) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      setUsers(users.filter(u => u.uid !== uid));
      toast.success("User record deleted");
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Directory</h1>
          <p className="text-muted-foreground">Manage platform access and permissions.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-border/50">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="bg-transparent border-none focus:ring-0 outline-none w-full text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border border-border/50 rounded-xl bg-background overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Identity</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20">Accessing secure nodes...</TableCell></TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20">No matching subjects found.</TableCell></TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold">{user.displayName}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="uppercase text-[9px] tracking-widest font-bold">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.createdAt?.toDate?.() ? user.createdAt.toDate().toLocaleDateString() : 'Historical'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-9 w-9 hover:bg-stone-100 hover:text-stone-900 active:scale-95 transition-all"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="p-2 w-48">
                        <DropdownMenuItem onClick={() => toggleAdmin(user)} className="rounded-lg cursor-pointer py-2.5 px-3">
                          <Shield className="h-4 w-4 mr-2 text-stone-500" />
                          {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          variant="destructive"
                          className="rounded-lg cursor-pointer py-2.5 px-3" 
                          onClick={() => deleteUserRecord(user.uid)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Purge Record
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
    </div>
  );
}
