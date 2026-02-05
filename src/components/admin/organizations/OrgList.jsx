import React, { useState, useMemo } from 'react';
import { useAdminOrg } from '@/contexts/AdminOrganizationContext';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Building, MoreVertical, ArrowRight, PlusCircle, Filter, Download 
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/utils/adminHelpers';

const OrgList = ({ onCreateNew }) => {
  const { organizations, selectOrganization } = useAdminOrg();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrgs = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            org.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
      // Note: Assuming 'status' field exists or defaulting to Active if missing for now
      // In real app, we'd use the actual status column if added
      const orgStatus = org.status || 'active'; 
      const matchesStatus = statusFilter === 'all' || orgStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'inactive': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search organizations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-950 border-slate-700"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-700 bg-slate-950">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('suspended')}>Suspended</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-700 bg-slate-950">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button onClick={onCreateNew} className="bg-lime-600 hover:bg-lime-700 text-white">
            <PlusCircle className="h-4 w-4 mr-2" /> New Organization
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-slate-800 bg-slate-900/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-950">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-400">Organization</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Contact</TableHead>
              <TableHead className="text-slate-400">Joined</TableHead>
              <TableHead className="text-right text-slate-400">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrgs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-slate-500">
                  No organizations found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrgs.map((org) => (
                <TableRow key={org.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => selectOrganization(org.id)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-slate-800 flex items-center justify-center text-lime-500 font-bold text-lg">
                        {org.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{org.name}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{org.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(org.status || 'active')}>
                      {(org.status || 'Active').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-300">{org.contact_email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-400">{formatDate(org.created_at)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); selectOrganization(org.id); }}>
                      Manage <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrgList;