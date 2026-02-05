import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const UserFeedbackSystem = () => {
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2 text-center">
            <CardTitle className="text-lg text-slate-200">Was this help section useful?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex justify-center gap-4">
                <Button variant="outline" className="border-slate-700 hover:bg-emerald-900/20 hover:text-emerald-400 hover:border-emerald-800">
                    <ThumbsUp className="w-4 h-4 mr-2" /> Yes, it helped
                </Button>
                <Button variant="outline" className="border-slate-700 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800">
                    <ThumbsDown className="w-4 h-4 mr-2" /> No, I'm still stuck
                </Button>
            </div>
            
            <div className="border-t border-slate-800 pt-4">
                <label className="text-sm text-slate-400 mb-2 block">How can we improve this documentation?</label>
                <Textarea className="bg-slate-950 border-slate-700 mb-3" placeholder="Tell us what's missing or unclear..." />
                <Button size="sm" className="w-full bg-slate-800 hover:bg-slate-700">Send Feedback</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserFeedbackSystem;