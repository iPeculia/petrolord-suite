import React from 'react';
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

const UnsavedChangesDialog = ({ isOpen, onSave, onDiscard, onCancel }) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-slate-900 border-slate-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            You have unsaved changes in your current session. Would you like to save them before leaving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} className="bg-transparent text-slate-400 hover:text-white border-slate-700 hover:bg-slate-800">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDiscard} className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50">Discard</AlertDialogAction>
          <AlertDialogAction onClick={onSave} className="bg-blue-600 text-white hover:bg-blue-500">Save & Exit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsavedChangesDialog;