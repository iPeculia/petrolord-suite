import React, { useState, useMemo } from 'react';
import { usePetroleumEconomics } from '../contexts/PetroleumEconomicsContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock, Unlock, Send, RotateCcw, ShieldCheck, Download, Calendar, Filter, User as UserIcon, History, Search, ArrowUpDown, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';

const GovernanceTab = () => {
  const { activeScenario, updateScenarioStatus, auditLogs } = usePetroleumEconomics();
  const { user } = useAuth();
  
  const [returnReason, setReturnReason] = useState("");
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  
  // --- Filtering State ---
  const [filterUser, setFilterUser] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterFieldType, setFilterFieldType] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  // --- Filtering & Sorting Logic ---
  const filteredLogs = useMemo(() => {
      const logs = auditLogs || [];
      let filtered = logs.filter(log => {
          const matchUser = filterUser === 'all' || (log.user?.email || log.user_id) === filterUser;
          const matchAction = filterAction === 'all' || log.action === filterAction;
          const matchFieldType = filterFieldType === 'all' || (log.changes?.category || '') === filterFieldType;
          
          let matchDate = true;
          if (dateRange.start && dateRange.end) {
              const logDate = new Date(log.timestamp);
              matchDate = isWithinInterval(logDate, { start: new Date(dateRange.start), end: new Date(dateRange.end) });
          }

          let matchSearch = true;
          if (searchTerm) {
              const searchLower = searchTerm.toLowerCase();
              const field = (log.changes?.field || '').toLowerCase();
              const oldVal = String(log.changes?.old_value || '').toLowerCase();
              const newVal = String(log.changes?.new_value || '').toLowerCase();
              matchSearch = field.includes(searchLower) || oldVal.includes(searchLower) || newVal.includes(searchLower);
          }

          return matchUser && matchAction && matchFieldType && matchDate && matchSearch;
      });

      // Sorting
      filtered.sort((a, b) => {
          let aVal, bVal;
          
          switch (sortConfig.key) {
              case 'timestamp': 
                  aVal = new Date(a.timestamp).getTime(); 
                  bVal = new Date(b.timestamp).getTime(); 
                  break;
              case 'user': 
                  aVal = (a.user?.email || a.user_id || '').toLowerCase(); 
                  bVal = (b.user?.email || b.user_id || '').toLowerCase(); 
                  break;
              case 'action': 
                  aVal = (a.action || '').toLowerCase(); 
                  bVal = (b.action || '').toLowerCase(); 
                  break;
              case 'field': 
                  aVal = (a.changes?.field || '').toLowerCase(); 
                  bVal = (b.changes?.field || '').toLowerCase(); 
                  break;
              default: 
                  return 0;
          }

          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });

      return filtered;
  }, [auditLogs, filterUser, filterAction, filterFieldType, dateRange, searchTerm, sortConfig]);

  if (!activeScenario) {
      return <div className="p-8 text-center text-slate-500">No active scenario selected.</div>;
  }

  // --- Status Workflow Helpers ---
  const currentStatus = activeScenario.status || 'draft';
  
  const getStatusBadge = (status) => {
      switch (status) {
          case 'draft': return <Badge variant="secondary" className="bg-slate-700 text-slate-300 hover:bg-slate-700">Draft</Badge>;
          case 'reviewed': return <Badge className="bg-blue-600 hover:bg-blue-600">Reviewed</Badge>;
          case 'approved': return <Badge className="bg-emerald-600 hover:bg-emerald-600">Approved</Badge>;
          default: return <Badge variant="outline">Unknown</Badge>;
      }
  };

  const handleStatusChange = (newStatus) => {
      if (newStatus === 'draft' && currentStatus !== 'draft') {
          setIsReturnDialogOpen(true);
      } else {
          updateScenarioStatus(activeScenario.id, newStatus);
      }
  };

  const confirmReturnToDraft = () => {
      updateScenarioStatus(activeScenario.id, 'draft', returnReason);
      setIsReturnDialogOpen(false);
      setReturnReason("");
  };

  // --- Highlighting Logic ---
  const isSignificantChange = (log) => {
      if (!log.changes || !log.changes.old_value || !log.changes.new_value) return false;
      
      const oldVal = parseFloat(log.changes.old_value);
      const newVal = parseFloat(log.changes.new_value);
      const field = log.changes.field || '';

      if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) return false;

      const pctChange = Math.abs((newVal - oldVal) / oldVal) * 100;

      if (field.includes('CAPEX') && pctChange > 10) return true;
      if (field.includes('Price') && pctChange > 5) return true;
      
      return false;
  };

  const uniqueActions = Array.from(new Set((auditLogs || []).map(l => l.action).filter(Boolean)));
  const uniqueUsers = Array.from(new Set((auditLogs || []).map(l => l.user?.email || l.user_id).filter(Boolean)));
  const uniqueCategories = Array.from(new Set((auditLogs || []).map(l => l.changes?.category).filter(Boolean)));

  const requestSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
      if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
      return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-blue-400" /> : <ArrowDown className="w-3 h-3 ml-1 text-blue-400" />;
  };

  const handleExportAuditLog = () => {
      const exportData = filteredLogs.map(log => ({
          Timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
          User: log.user?.email || log.user_id,
          Action: log.action,
          Category: log.changes?.category || '',
          Field: log.changes?.field || '',
          'Old Value': typeof log.changes?.old_value === 'object' ? JSON.stringify(log.changes.old_value) : log.changes?.old_value,
          'New Value': typeof log.changes?.new_value === 'object' ? JSON.stringify(log.changes.new_value) : log.changes?.new_value,
          Reason: log.changes?.reason || ''
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Audit Log");
      XLSX.writeFile(wb, `Audit_Log_${activeScenario.name.replace(/\s+/g, '_')}.xlsx`);
  };

  // Summary Stats
  const lastModified = filteredLogs.length > 0 ? filteredLogs[0] : null;
  const summaryText = lastModified 
      ? `Total changes: ${filteredLogs.length}, Last modified: ${format(new Date(lastModified.timestamp), 'MMM d, p')} by ${lastModified.user?.email || 'Unknown'}`
      : "No changes recorded.";

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* 1. Status Workflow Control Panel */}
      <Card className="bg-slate-900 border-slate-800 shrink-0">
        <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-lg text-slate-100 flex items-center gap-3">
                        {activeScenario.name}
                        {getStatusBadge(currentStatus)}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                        Manage the lifecycle and governance state of this scenario.
                        {currentStatus !== 'draft' && <span className="text-amber-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked for editing</span>}
                    </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-slate-500">
                    <span>Last Updated: {activeScenario.updated_at ? format(new Date(activeScenario.updated_at), 'PPP p') : 'Never'}</span>
                    <span>Created By: {user?.email}</span>
                </div>
            </div>
        </CardHeader>
        <CardContent className="border-t border-slate-800 pt-6">
            <div className="flex items-center gap-4">
                {/* Workflow Transitions */}
                <div className="flex items-center gap-2">
                    {currentStatus === 'draft' && (
                        <Button className="bg-blue-600 hover:bg-blue-500" onClick={() => handleStatusChange('reviewed')}>
                            <Send className="w-4 h-4 mr-2" /> Submit for Review
                        </Button>
                    )}
                    
                    {currentStatus === 'reviewed' && (
                        <>
                            <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={() => handleStatusChange('approved')}>
                                <ShieldCheck className="w-4 h-4 mr-2" /> Approve
                            </Button>
                            <Button variant="outline" className="border-slate-700 hover:bg-slate-800" onClick={() => handleStatusChange('draft')}>
                                <RotateCcw className="w-4 h-4 mr-2" /> Return to Draft
                            </Button>
                        </>
                    )}

                    {currentStatus === 'approved' && (
                        <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-amber-500 hover:text-amber-400" onClick={() => handleStatusChange('draft')}>
                            <Unlock className="w-4 h-4 mr-2" /> Unlock (Return to Draft)
                        </Button>
                    )}
                </div>

                {/* Return Reason Dialog */}
                <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
                    <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                        <DialogHeader>
                            <DialogTitle>Return to Draft</DialogTitle>
                            <DialogDescription>
                                Providing a reason helps track why this scenario was sent back for revision.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="reason" className="mb-2 block">Reason for Return</Label>
                            <Textarea 
                                id="reason" 
                                placeholder="e.g. Assumptions need update based on new Q3 data..." 
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                className="bg-slate-950 border-slate-700"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsReturnDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmReturnToDraft}>Confirm Return</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </CardContent>
      </Card>

      {/* 2. Audit Log Viewer */}
      <div className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-200 font-medium">
                      <History className="w-4 h-4 text-slate-400" />
                      Audit Log
                      <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <HelpCircle className="w-3 h-3 text-slate-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Tracks all changes to inputs, assumptions, and workflow status for this scenario.</p>
                            </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                      {summaryText}
                  </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                      <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-500" />
                      <Input 
                          placeholder="Search fields or values..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="h-8 w-48 pl-8 bg-slate-900 border-slate-700 text-xs"
                      />
                  </div>

                  <Select value={filterUser} onValueChange={setFilterUser}>
                      <SelectTrigger className="w-[130px] h-8 bg-slate-900 border-slate-700 text-xs">
                          <div className="flex items-center gap-2 truncate">
                              <UserIcon className="w-3 h-3 text-slate-500" />
                              <SelectValue placeholder="User" />
                          </div>
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          {uniqueUsers.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                  </Select>

                  <Select value={filterAction} onValueChange={setFilterAction}>
                      <SelectTrigger className="w-[130px] h-8 bg-slate-900 border-slate-700 text-xs">
                          <SelectValue placeholder="Action Type" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Actions</SelectItem>
                          {uniqueActions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                  </Select>

                  <Select value={filterFieldType} onValueChange={setFilterFieldType}>
                      <SelectTrigger className="w-[130px] h-8 bg-slate-900 border-slate-700 text-xs">
                          <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {uniqueCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded px-2 h-8">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <input 
                          type="date" 
                          className="bg-transparent text-xs w-24 focus:outline-none text-slate-300"
                          value={dateRange.start}
                          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                      <span className="text-slate-600">-</span>
                      <input 
                          type="date" 
                          className="bg-transparent text-xs w-24 focus:outline-none text-slate-300"
                          value={dateRange.end}
                          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                  </div>
                  
                  <div className="ml-auto">
                      <Button variant="outline" size="sm" onClick={handleExportAuditLog} className="h-8 border-slate-700 bg-slate-800 text-slate-300 hover:text-white">
                          <Download className="w-3 h-3 mr-2" /> Export CSV
                      </Button>
                  </div>
              </div>
          </div>
          
          <div className="flex-1 overflow-auto">
              <Table>
                  <TableHeader className="bg-slate-950 sticky top-0 z-10 shadow-sm">
                      <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="w-[160px] text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => requestSort('timestamp')}>
                              <div className="flex items-center">Date/Time {getSortIcon('timestamp')}</div>
                          </TableHead>
                          <TableHead className="w-[180px] text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => requestSort('user')}>
                              <div className="flex items-center">User {getSortIcon('user')}</div>
                          </TableHead>
                          <TableHead className="w-[120px] text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => requestSort('action')}>
                              <div className="flex items-center">Action {getSortIcon('action')}</div>
                          </TableHead>
                          <TableHead className="w-[180px] text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => requestSort('field')}>
                              <div className="flex items-center">Field {getSortIcon('field')}</div>
                          </TableHead>
                          <TableHead className="text-slate-400 text-right w-[120px]">Old Value</TableHead>
                          <TableHead className="w-8"></TableHead>
                          <TableHead className="text-slate-400 text-left w-[120px]">New Value</TableHead>
                          <TableHead className="text-slate-400">Reason / Notes</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {filteredLogs.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                                  No audit records found matching your criteria.
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredLogs.map((log, idx) => {
                              const isImportant = isSignificantChange(log);
                              return (
                                  <TableRow key={idx} className={cn("border-slate-800 hover:bg-slate-800/30 text-xs font-mono group transition-colors", isImportant && "bg-amber-950/10 hover:bg-amber-950/20")}>
                                      <TableCell className="text-slate-400 whitespace-nowrap">
                                          {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                                      </TableCell>
                                      <TableCell className="text-slate-300">
                                          <div className="flex items-center gap-2 max-w-[160px]">
                                              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                                                  <UserIcon className="w-3 h-3" />
                                              </div>
                                              <span className="truncate" title={log.user?.email}>{log.user?.email || 'Unknown User'}</span>
                                          </div>
                                      </TableCell>
                                      <TableCell>
                                          <Badge variant="outline" className={cn("font-normal border-opacity-50", 
                                              log.action === 'Update' ? "bg-blue-950/30 border-blue-800 text-blue-400" :
                                              log.action === 'Create' ? "bg-emerald-950/30 border-emerald-800 text-emerald-400" :
                                              log.action === 'Delete' ? "bg-red-950/30 border-red-800 text-red-400" :
                                              "bg-slate-900/50 border-slate-700 text-slate-400"
                                          )}>
                                              {log.action}
                                          </Badge>
                                      </TableCell>
                                      <TableCell className="text-slate-300 font-medium">
                                          {log.changes?.field || '-'}
                                          {log.changes?.category && <span className="ml-2 text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-800">{log.changes.category}</span>}
                                      </TableCell>
                                      <TableCell className="text-right text-red-400/70">
                                          {String(log.changes?.old_value ?? '')}
                                      </TableCell>
                                      <TableCell className="text-center text-slate-600">→</TableCell>
                                      <TableCell className={cn("text-left font-semibold", isImportant ? "text-amber-400" : "text-emerald-400")}>
                                          {String(log.changes?.new_value ?? '')}
                                      </TableCell>
                                      <TableCell className="text-slate-500 italic max-w-[200px] truncate" title={log.changes?.reason || ''}>
                                          {log.changes?.reason || '-'}
                                      </TableCell>
                                  </TableRow>
                              );
                          })
                      )}
                  </TableBody>
              </Table>
          </div>
      </div>
    </div>
  );
};

export default GovernanceTab;