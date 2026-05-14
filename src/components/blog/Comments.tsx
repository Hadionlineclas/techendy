import React, { useState, useEffect } from 'react';
import { 
  db, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  createdAt: any;
}

interface CommentsProps {
  postId: string;
}

export const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { user, profile, signIn } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Correctly reference the subcollection as per rules: /posts/{postId}/comments
    const commentsRef = collection(db, `posts/${postId}/comments`);
    const q = query(
      commentsRef, 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `posts/${postId}/comments`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      signIn();
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, `posts/${postId}/comments`), {
        postId,
        userId: user.uid,
        userName: profile?.displayName || user.displayName || 'Anonymous User',
        userPhoto: profile?.photoURL || user.photoURL || '',
        content: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment('');
      toast.success("Comment posted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-stone-200">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="h-5 w-5 text-stone-400" />
        <h3 className="text-2xl serif italic">Discussions</h3>
        <span className="bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
          {comments.length}
        </span>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-12 space-y-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 border border-stone-200">
              <AvatarImage src={user.photoURL || ''} />
              <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Share your perspective..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] border-stone-200 focus-visible:ring-stone-400 rounded-xl resize-none bg-stone-50/50"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={submitting || !newComment.trim()}
                  className="rounded-full bg-black text-white hover:bg-stone-800 text-[10px] font-bold uppercase tracking-widest h-10 px-8"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Post Thought
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-4">
          <p className="text-stone-500">Sign in to join the conversation.</p>
          <Button 
            onClick={() => signIn()}
            variant="outline"
            className="rounded-full px-8 text-[10px] font-bold uppercase tracking-widest border-stone-300"
          >
            Authenticate
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center py-8 text-stone-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <Avatar className="h-10 w-10 border border-stone-200">
                <AvatarImage src={comment.userPhoto} />
                <AvatarFallback>{comment.userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">{comment.userName}</span>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                    {comment.createdAt?.toDate ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed text-sm">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-12 text-stone-400 text-sm italic">
            No thoughts shared yet. Be the first to initiate.
          </p>
        )}
      </div>
    </div>
  );
};
