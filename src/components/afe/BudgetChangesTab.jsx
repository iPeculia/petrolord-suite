import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { History, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const BudgetChangesTab = ({ afeId, changes, currentBudget, onRefresh }) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    reason: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('afe_changes').insert([{
      ...formData,
      afe_id: afeId,
      status: 'Pending'
    }]);

    if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
    else {
      toast({ title: 'Success', description: 'Change request submitted.' });
      setIsDialogOpen(false);
      onRefresh();
    }
  };

  const handleAction = async (change, action) => {
    if (action === 'Approved') {
      const { data: afe } = await supabase.from('afes').select('budget').eq('id', afeId).single();
      await supabase.from('afes').update({ budget: (afe.budget || 0) + Number(change.amount) }).eq('id', afeId);
    }
    
    await supabase.from('afe_changes').update({ status: action }).eq('id', change.id);
    onRefresh();
  };

  return (
    <div className="space-y-4 bg-slate-900/50 p-4 rounded border border-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Change Control Log</h3>
          <p className="text-xs text-slate-400">Current Approved Budget: <span className="text-lime-400 font-mono">${currentBudget.toLocaleString()}</span></p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <History className="w-4 h-4 mr-2" /> Request Change
        </Button>
      </div>

      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow>
            <TableHead className="text-slate-300">Date</TableHead>
            <TableHead className="text-slate-300">Description</TableHead>
            <TableHead className="text-slate-300">Reason</TableHead>
            <TableHead className="text-right text-slate-300">Amount</TableHead>
            <TableHead className="text-center text-slate-300">Status</TableHead>
            <TableHead className="text-center text-slate-300">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {changes.map(change => (
            <TableRow key={change.id} className="border-b border-slate-800/50">
              <TableCell className="text-slate-400">{new Date(change.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-white">{change.description}</TableCell>
              <TableCell className="text-slate-400 text-sm">{change.reason}</TableCell>
              <TableCell className={`text-right font-mono ${change.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change.amount > 0 ? '+' : ''}{Number(change.amount).toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={
                  change.status === 'Approved' ? 'text-green-400 border-green-500/50' : 
                  change.status === 'Rejected' ? 'text-red-400 border-red-500/50' : 'text-yellow-400 border-yellow-500/50'
                }>{change.status}</Badge>
              </TableCell>
              <TableCell className="text-center">
                {change.status === 'Pending' && (
                  <div className="flex justify-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleAction(change, 'Approved')} className="text-green-500 hover:bg-green-900/20"><CheckCircle className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleAction(change, 'Rejected')} className="text-red-500 hover:bg-red-900/20"><XCircle className="w-4 h-4" /></Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {changes.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-500">No changes recorded.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader><DialogTitle>Request Budget Change</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Description</Label>
              <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-slate-800 border-slate-700" required />
            </div>
            <div>
              <Label>Amount ($)</Label>
              <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="bg-slate-800 border-slate-700" required placeholder="+ for increase, - for decrease" />
            </div>
            <div>
              <Label>Reason / Justification</Label>
              <Input value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="bg-slate-800 border-slate-700" required />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-purple-600">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetChangesTab;