import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const ExcelLikeTable = ({ columns, data, onDataChange, rowKey = 'id' }) => {
  const [selectedCell, setSelectedCell] = useState(null); // { rowIdx, colKey }
  const [editingCell, setEditingCell] = useState(null);   // { rowIdx, colKey }
  const tableRef = useRef(null);

  // Helper to get safe value
  const getVal = (rowIdx, colKey) => {
    if (!data[rowIdx]) return '';
    return data[rowIdx][colKey];
  };

  const handleCellClick = (rowIdx, colKey) => {
    if (editingCell) return; // Don't change selection if editing
    setSelectedCell({ rowIdx, colKey });
  };

  const handleDoubleClick = (rowIdx, colKey) => {
    setEditingCell({ rowIdx, colKey });
  };

  const updateValue = (rowIdx, colKey, value) => {
    const newData = [...data];
    if (!newData[rowIdx]) return;
    newData[rowIdx] = { ...newData[rowIdx], [colKey]: value };
    onDataChange(newData);
  };

  const handleKeyDown = (e) => {
    if (editingCell) {
        if (e.key === 'Enter') {
            e.preventDefault();
            setEditingCell(null);
            // Move selection down
            if (selectedCell && selectedCell.rowIdx < data.length - 1) {
                setSelectedCell({ ...selectedCell, rowIdx: selectedCell.rowIdx + 1 });
            }
        }
        return;
    }

    if (!selectedCell) return;

    const { rowIdx, colKey } = selectedCell;
    const colIdx = columns.findIndex(c => c.key === colKey);

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (rowIdx > 0) setSelectedCell({ rowIdx: rowIdx - 1, colKey });
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (rowIdx < data.length - 1) setSelectedCell({ rowIdx: rowIdx + 1, colKey });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (colIdx > 0) setSelectedCell({ rowIdx, colKey: columns[colIdx - 1].key });
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (colIdx < columns.length - 1) setSelectedCell({ rowIdx, colKey: columns[colIdx + 1].key });
        break;
      case 'Enter':
        e.preventDefault();
        setEditingCell(selectedCell);
        break;
      case 'Tab':
        e.preventDefault();
        if (colIdx < columns.length - 1) {
            setSelectedCell({ rowIdx, colKey: columns[colIdx + 1].key });
        } else if (rowIdx < data.length - 1) {
            setSelectedCell({ rowIdx: rowIdx + 1, colKey: columns[0].key });
        }
        break;
      case 'Delete':
      case 'Backspace':
        if (!columns.find(c => c.key === colKey).readOnly) {
            updateValue(rowIdx, colKey, '');
        }
        break;
      default:
        // Start editing if alphanumeric char
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
             if (!columns.find(c => c.key === colKey).readOnly) {
                setEditingCell(selectedCell);
                // Note: The key press will be lost for the input unless we handle it specially,
                // but standard Excel behavior usually clears/replaces on typing.
                // For React simply setting editing state is safer for now.
             }
        }
        break;
    }
  };

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    if (!selectedCell) return;
    
    const clipboardData = e.clipboardData.getData('text/plain');
    const rows = clipboardData.split(/\r\n|\n|\r/).filter(row => row.trim() !== '');
    
    const newData = [...data];
    let startRowIdx = selectedCell.rowIdx;
    let startColIdx = columns.findIndex(c => c.key === selectedCell.colKey);

    rows.forEach((rowStr, rOffset) => {
        const targetRowIdx = startRowIdx + rOffset;
        if (targetRowIdx >= newData.length) return;

        const cells = rowStr.split('\t');
        cells.forEach((cellVal, cOffset) => {
            const targetColIdx = startColIdx + cOffset;
            if (targetColIdx >= columns.length) return;
            
            const col = columns[targetColIdx];
            if (!col.readOnly) {
                let val = cellVal.trim();
                // Attempt to parse number if column expects it
                if (col.type === 'number') {
                    val = parseFloat(val.replace(/,/g, '')); // simplistic parsing
                    if (isNaN(val)) val = cellVal.trim();
                }
                newData[targetRowIdx] = { ...newData[targetRowIdx], [col.key]: val };
            }
        });
    });
    
    onDataChange(newData);
  }, [data, columns, selectedCell, onDataChange]);

  // Attach global paste listener if focused? Better to attach to table container
  useEffect(() => {
      const el = tableRef.current;
      if (el) {
          el.addEventListener('paste', handlePaste);
          return () => el.removeEventListener('paste', handlePaste);
      }
  }, [handlePaste]);


  return (
    <div 
        ref={tableRef}
        className="w-full h-full overflow-auto outline-none" 
        tabIndex={0} 
        onKeyDown={handleKeyDown}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-slate-900">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={cn(
                    "border border-slate-700 px-3 py-2 text-left font-medium text-slate-300 select-none",
                    col.width ? `w-[${col.width}]` : 'w-auto'
                )}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row[rowKey] || rowIdx} className="hover:bg-slate-800/50">
              {columns.map((col, colIdx) => {
                const isSelected = selectedCell?.rowIdx === rowIdx && selectedCell?.colKey === col.key;
                const isEditing = editingCell?.rowIdx === rowIdx && editingCell?.colKey === col.key;
                
                return (
                  <td 
                    key={col.key}
                    onClick={() => handleCellClick(rowIdx, col.key)}
                    onDoubleClick={() => handleDoubleClick(rowIdx, col.key)}
                    className={cn(
                        "border border-slate-800 px-3 py-1.5 relative min-w-[80px]",
                        isSelected ? "bg-blue-900/20 ring-2 ring-inset ring-blue-500 z-10" : "",
                        col.readOnly ? "bg-slate-900/30 text-slate-500" : "text-slate-200"
                    )}
                  >
                    {isEditing ? (
                        <input
                            autoFocus
                            type={col.type === 'number' ? 'number' : 'text'}
                            className="w-full h-full bg-slate-800 text-white outline-none border-none p-0 m-0"
                            value={row[col.key]}
                            onChange={(e) => updateValue(rowIdx, col.key, col.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                            onBlur={() => setEditingCell(null)}
                        />
                    ) : (
                        <div className="truncate w-full h-full cursor-default">
                            {col.formatter ? col.formatter(row[col.key]) : row[col.key]}
                        </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelLikeTable;