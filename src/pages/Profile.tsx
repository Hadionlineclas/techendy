import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  Trash2, 
  AlertTriangle,
  History,
  Settings,
  Bell
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

export default function Profile() {
  const { profile, signOut, loading, deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success("Account deleted successfully. We're sorry to see you go.");
    } catch (error) {
      toast.error("Failed to delete account. You might need to sign in again first.");
    }
  };

  if (loading) return <div className="p-20 text-center serif italic text-2xl">Syncing with neural profile...</div>;
  if (!profile) return <div className="p-20 text-center serif italic text-2xl">Please connect your identity to view your directive.</div>;

  const registrationDate = profile.createdAt?.toDate?.() 
    ? profile.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
    : 'May 8, 2026'; // Fallback to current relative if not found

  return (
    <div className="min-h-screen bg-stone-50/50 py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Info */}
          <div className="w-full md:w-80 space-y-6">
            <Card className="border-none shadow-xl shadow-stone-200/50 overflow-hidden rounded-3xl">
              <div className="h-32 bg-gradient-to-br from-stone-900 to-stone-800" />
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-12 left-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profile.photoURL} />
                    <AvatarFallback className="bg-stone-100 text-stone-400 capitalize">
                      {profile.displayName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="pt-16">
                  <h1 className="text-2xl font-bold tracking-tight mb-1">{profile.displayName}</h1>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-[9px] px-2 py-0 border-stone-200 text-stone-500 uppercase">
                      {profile.role}
                    </Badge>
                  </p>
                  
                  <div className="space-y-3 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Mail className="h-4 w-4 text-stone-400" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Calendar className="h-4 w-4 text-stone-400" />
                      <span>Joined {registrationDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Button 
              variant="outline" 
              className="w-full rounded-2xl border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-black transition-all group"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Disconnect Session
            </Button>
          </div>

          {/* Main Profile Content */}
          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-3xl border-none shadow-lg shadow-stone-200/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-4 w-4 text-stone-500" />
                    Engagement Metrics
                  </CardTitle>
                  <CardDescription>Your activity across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <div className="text-3xl font-bold mb-1">0</div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Interactions</div>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <div className="text-3xl font-bold mb-1">0</div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Saved Intel</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-lg shadow-stone-200/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-stone-500" />
                    Data Sovereignty
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Techendy respects your digital footprint. You have absolute control over your profile and associated metadata.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-400">
                    <span className="flex items-center gap-1.5 ring-1 ring-stone-100 px-3 py-1.5 rounded-full">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full" /> Encrypted
                    </span>
                    <span className="flex items-center gap-1.5 ring-1 ring-stone-100 px-3 py-1.5 rounded-full">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full" /> Verified
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border-none shadow-lg shadow-stone-200/40">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 text-stone-500" />
                  Account Security & Governance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-stone-400">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Email Notifications</h4>
                      <p className="text-xs text-stone-500">Stay updated with latest AI tools</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl h-8 text-[10px] uppercase font-bold tracking-widest">Active</Button>
                </div>

                <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-red-500 flex-shrink-0">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-950">Decommission Account</h4>
                      <p className="text-xs text-red-700/70 leading-relaxed">
                        Permanently erase your identity, comments, and engagement data from our systems. This action is definitive and cannot be reversed.
                      </p>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full bg-white border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-xl font-bold text-[10px] uppercase tracking-widest h-10">
                        Initiate Deletion Protocol
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                          <Trash2 className="h-5 w-5" />
                          Terminal Action Required
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                          Are you absolutely certain you wish to decommission your Techendy profile? This will purge all synthetic interactions and history.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteAccount} className="rounded-xl">
                          Confirm Purge
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

