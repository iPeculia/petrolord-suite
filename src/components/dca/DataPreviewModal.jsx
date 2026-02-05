import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, Check, AlertTriangle } from 'lucide-react';

const DataPreviewModal = ({ isOpen, onClose, data, headers, fileName, onConfirm }) => {
  const [mapping, setMapping] = useState({
    time: '',
    rate: '',
    well: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Auto-detect columns based on common names
    const lowerCaseHeaders = headers.map(h => h.toLowerCase());
    const timeHeader = headers[lowerCaseHeaders.findIndex(h => h.includes('date') || h.includes('time'))] || '';
    const rateHeader = headers[lowerCaseHeaders.findIndex(h => h.includes('rate'))] || '';
    const wellHeader = headers[lowerCaseHeaders.findIndex(h => h.includes('well'))] || '';
    
    setMapping({
      time: timeHeader,
      rate: rateHeader,
      well: wellHeader,
    });
  }, [headers]);

  const handleConfirm = () => {
    if (!mapping.time || !mapping.rate) {
      setError('Time and Rate columns are required.');
      return;
    }
    setError('');

    const mappedData = data.map(row => {
      const timeValue = row[mapping.time];
      let date;
      // Handle Excel date serial numbers
      if (typeof timeValue === 'number' && timeValue > 1 && timeValue < 60000) { // Common Excel date range
        date = new Date(Date.UTC(0, 0, timeValue - 1));
      } else {
        date = new Date(timeValue);
      }

      return {
        time: date.toISOString().split('T')[0], // Standardize to YYYY-MM-DD
        rate: parseFloat(row[mapping.rate]),
        well: mapping.well ? row[mapping.well] : null,
      };
    }).filter(row => !isNaN(row.rate) && row.time && row.time !== 'Invalid Date');

    if (mappedData.length === 0) {
      setError('No valid data could be mapped. Check column selections and data formats.');
      return;
    }

    onConfirm(mappedData, mapping);
  };

  const previewRows = data.slice(0, 10);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Map Data Columns</h2>
                <p className="text-purple-300 truncate">File: {fileName}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}><X className="w-6 h-6" /></Button>
            </header>

            <main className="p-6 flex-grow overflow-y-auto">
              <p className="text-lime-200 mb-6">
                Please select the columns from your file that correspond to Time, Rate, and Well Name.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-white/5 p-4 rounded-lg">
                <div>
                  <Label className="text-lime-300 font-semibold">Time Column (Required)</Label>
                  <p className="text-xs text-lime-400/70 mb-2">Date or time values.</p>
                  <Select value={mapping.time} onValueChange={(value) => setMapping(m => ({ ...m, time: value }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Select Time Column" /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">{headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-lime-300 font-semibold">Rate Column (Required)</Label>
                   <p className="text-xs text-lime-400/70 mb-2">Numerical production rates.</p>
                  <Select value={mapping.rate} onValueChange={(value) => setMapping(m => ({ ...m, rate: value }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Select Rate Column" /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">{headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-lime-300 font-semibold">Well Name Column (Optional)</Label>
                   <p className="text-xs text-lime-400/70 mb-2">Identifier for each well.</p>
                  <Select value={mapping.well} onValueChange={(value) => setMapping(m => ({ ...m, well: value }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Select Well Column" /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="">None</SelectItem>
                      {headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Data Preview</h3>
              <div className="overflow-x-auto border border-white/10 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-white/10">
                      {headers.map(header => (
                        <TableHead key={header} className={`text-white p-3 whitespace-nowrap ${header === mapping.time ? 'bg-blue-500/20' : ''} ${header === mapping.rate ? 'bg-green-500/20' : ''} ${header === mapping.well ? 'bg-yellow-500/20' : ''}`}>
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row, rowIndex) => (
                      <TableRow key={rowIndex} className="border-white/10 hover:bg-white/5">
                        {headers.map(header => (
                          <TableCell key={`${rowIndex}-${header}`} className="text-slate-300 p-3 text-sm whitespace-nowrap">
                            {String(row[header])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </main>

            <footer className="p-6 border-t border-white/10">
              {error && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="flex items-center text-red-400 bg-red-500/10 p-3 rounded-lg mb-4">
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  <p>{error}</p>
                </motion.div>
              )}
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={onClose} className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">Cancel</Button>
                <Button onClick={handleConfirm} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Check className="w-5 h-5 mr-2" />
                  Confirm &amp; Continue
                </Button>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DataPreviewModal;