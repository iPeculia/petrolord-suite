import React, { useEffect, useState } from 'react';
import { useAdminOrg } from '@/contexts/AdminOrganizationContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/customSupabaseClient';
import { formatDate } from '@/utils/adminHelpers';

const OrgAudit = () => {
  const { selectedOrg } = useAdminOrg();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      // Mock query - assuming we might store org_id in details or similar
      // In production, audit_logs should probably have an organization_id column
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      setLogs(data || []);
      setLoading(false);
    };
    fetchLogs();
  }, [selectedOrg]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800">
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center h-20">Loading audit logs...</TableCell></TableRow>
            ) : logs.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center h-20 text-slate-500">No audit logs found.</TableCell></TableRow>
            ) : (
              logs.map(log => (
                <TableRow key={log.id} className="border-slate-800">
                  <TableCell className="font-mono text-xs text-blue-400">{log.action}</TableCell>
                  <TableCell className="text-xs text-slate-400">{log.actor_id?.substring(0,8)}...</TableCell>
                  <TableCell className="text-xs text-slate-300 max-w-xs truncate">{JSON.stringify(log.details)}</TableCell>
                  <TableCell className="text-xs text-slate-500">{formatDate(log.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrgAudit;