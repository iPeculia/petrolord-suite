import React, { useState } from 'react';
import { useFDP } from '@/contexts/FDPContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare, Check } from 'lucide-react';

const CommentAndAnnotation = () => {
    const { state } = useFDP();
    const { comments } = state.collaboration;
    const [newComment, setNewComment] = useState('');

    const handleSubmit = () => {
        // Mock submission
        setNewComment('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <h3 className="text-sm font-bold text-white mb-4">Add Comment</h3>
                        <div className="space-y-3">
                             <Textarea 
                                placeholder="Type your comment here... use @ to mention team members" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="bg-slate-800 border-slate-700 min-h-[100px]"
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                                    <Send className="w-4 h-4 mr-2" /> Post Comment
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {comments.map((comment) => (
                        <Card key={comment.id} className="bg-slate-900 border-slate-800">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-white text-sm">{comment.authorName}</div>
                                        <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                    </div>
                                    {comment.resolved ? (
                                        <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded flex items-center">
                                            <Check className="w-3 h-3 mr-1" /> Resolved
                                        </span>
                                    ) : (
                                        <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-400 hover:text-green-400">
                                            Resolve
                                        </Button>
                                    )}
                                </div>
                                <p className="text-sm text-slate-300">{comment.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                 <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <h3 className="text-sm font-bold text-white mb-4">Filter</h3>
                        <div className="space-y-2">
                            <Button variant="secondary" className="w-full justify-start text-xs">All Comments</Button>
                            <Button variant="ghost" className="w-full justify-start text-xs text-slate-400">My Mentions</Button>
                            <Button variant="ghost" className="w-full justify-start text-xs text-slate-400">Resolved</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CommentAndAnnotation;