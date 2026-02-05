import React, { useState } from 'react';
import { useAdminOrg } from '@/contexts/AdminOrganizationContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, Eye, FileDown, Edit2, Send, Trash2, AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency, formatDate } from '@/utils/adminHelpers';
import { generateQuotePDF } from '@/utils/quotePdfGenerator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Components
import QuoteEditor from './quotes/QuoteEditor';
import QuotePreview from './quotes/QuotePreview';
import EmailQuoteModal from './quotes/EmailQuoteModal';

// Mock quotes data
const MOCK_QUOTES = [
  { 
    id: 'QT-2023-001', 
    date: '2023-10-15', 
    amount: 3450, 
    status: 'draft', 
    name: 'Q4 Expansion',
    expiryDate: '2023-11-15',
    terms: 'Standard Lordsway Energy Terms apply.'
  },
  { 
    id: 'QT-2023-002', 
    date: '2023-10-10', 
    amount: 1200, 
    status: 'sent', 
    name: 'Additional Storage',
    expiryDate: '2023-11-10',
    terms: 'Payment due on receipt.' 
  },
];

const OrgQuotes = () => {
  const { selectedOrg } = useAdminOrg();
  const { toast } = useToast();
  
  const [quotes, setQuotes] = useState(MOCK_QUOTES);
  const [editingQuote, setEditingQuote] = useState(null); // For Editor
  const [previewingQuote, setPreviewingQuote] = useState(null); // For Preview Modal
  const [emailingQuote, setEmailingQuote] = useState(null); // For Email Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null); // For Delete Confirmation
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); // Loading state for PDF gen

  // --- Actions ---

  const handleNewQuote = () => {
    setEditingQuote({
      id: `QT-${new Date().getFullYear()}-${quotes.length + 1}`.toUpperCase(),
      name: 'New Proposal',
      date: new Date().toISOString(),
      status: 'draft',
      config: {
        modules: [],
        apps: [],
        userCount: selectedOrg?.subscription?.user_limit || 5,
        storageGB: 100,
        tierId: 'starter'
      }
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (quote) => {
    setEditingQuote({ ...quote });
    setIsEditorOpen(true);
  };

  const handleSaveQuote = () => {
    if (!editingQuote) return;
    
    const amount = editingQuote.config?.calculated?.monthlyTotal || editingQuote.amount || 0;
    const updatedQuote = { ...editingQuote, amount };

    setQuotes(prev => {
      const exists = prev.find(q => q.id === updatedQuote.id);
      if (exists) {
        return prev.map(q => q.id === updatedQuote.id ? updatedQuote : q);
      }
      return [updatedQuote, ...prev];
    });

    setIsEditorOpen(false);
    toast({ title: 'Quote Saved', description: `${updatedQuote.id} updated successfully.` });
  };

  const handleDeleteClick = (id) => {
    setQuoteToDelete(id);
  };

  const confirmDelete = () => {
    if (quoteToDelete) {
      setQuotes(prev => prev.filter(q => q.id !== quoteToDelete));
      toast({ title: 'Quote Deleted' });
      setQuoteToDelete(null);
    }
  };

  const handleDownloadPDF = async (quote) => {
    setIsGeneratingPdf(true);
    try {
      toast({ title: 'Download Started', description: 'Generating Lordsway branded PDF...' });
      const doc = await generateQuotePDF(quote, selectedOrg);
      doc.save(`Lordsway_Quote_${quote.id}.pdf`);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to generate PDF', variant: 'destructive' });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // --- Helpers ---

  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-slate-800 text-slate-400 border-slate-700",
      sent: "bg-blue-900/20 text-blue-400 border-blue-800",
      accepted: "bg-green-900/20 text-green-400 border-green-800",
      rejected: "bg-red-900/20 text-red-400 border-red-800",
      expired: "bg-orange-900/20 text-orange-400 border-orange-800"
    };
    return <Badge variant="outline" className={styles[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Quote Management</h3>
          <p className="text-sm text-slate-400">Create and track custom pricing proposals.</p>
        </div>
        <Button onClick={handleNewQuote} className="bg-[#4CAF50] hover:bg-[#388E3C] text-white">
          <PlusCircle className="h-4 w-4 mr-2" /> New Quote
        </Button>
      </div>

      {/* Quote Table */}
      <div className="border border-slate-800 rounded-md bg-slate-900/50 flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-slate-900">
              <TableHead>Quote ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Amount (Monthly)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-slate-500">No quotes found.</TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => (
                <TableRow key={quote.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-mono text-slate-300">{quote.id}</TableCell>
                  <TableCell className="font-medium text-slate-200">{quote.name}</TableCell>
                  <TableCell className="text-slate-400">{formatDate(quote.date)}</TableCell>
                  <TableCell className="text-slate-400">{formatDate(quote.expiryDate)}</TableCell>
                  <TableCell className="text-slate-200">{formatCurrency(quote.amount)}</TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Preview" onClick={() => setPreviewingQuote(quote)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {quote.status === 'draft' && (
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEdit(quote)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}

                      <Button variant="ghost" size="icon" title="Send Email" onClick={() => setEmailingQuote(quote)}>
                        <Send className="h-4 w-4 text-blue-400" />
                      </Button>

                      <Button variant="ghost" size="icon" title="Download PDF" onClick={() => handleDownloadPDF(quote)} disabled={isGeneratingPdf}>
                        <FileDown className="h-4 w-4" />
                      </Button>

                      {quote.status === 'draft' && (
                        <Button variant="ghost" size="icon" title="Delete" className="hover:text-red-400 hover:bg-red-950/30" onClick={() => handleDeleteClick(quote.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Modals --- */}

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-[95vw] w-[1200px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingQuote?.id ? `Edit Quote: ${editingQuote.id}` : 'New Quote'}</DialogTitle>
            <DialogDescription>Configure pricing, details, and terms.</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden py-2">
            <QuoteEditor 
              initialQuote={editingQuote} 
              onChange={setEditingQuote}
            />
          </div>

          <DialogFooter className="mt-auto pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveQuote} className="bg-[#4CAF50] hover:bg-[#388E3C] text-white">
              Save Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog (Full Screen Overlay) */}
      {previewingQuote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-5xl h-full bg-transparent">
            <QuotePreview 
              quote={previewingQuote} 
              organization={selectedOrg} 
              onClose={() => setPreviewingQuote(null)} 
            />
          </div>
        </div>
      )}

      {/* Email Dialog */}
      <EmailQuoteModal 
        isOpen={!!emailingQuote} 
        onClose={() => setEmailingQuote(null)} 
        quote={emailingQuote}
        organization={selectedOrg}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!quoteToDelete} onOpenChange={(open) => !open && setQuoteToDelete(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete the quote.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrgQuotes;