import React, { useState, useRef } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { UploadCloud, File as FileIcon, X } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";

    const ApplicationForm = ({ isOpen, onClose, jobTitle }) => {
      const { toast } = useToast();
      const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
      });
      const [coverLetter, setCoverLetter] = useState('');
      const [resume, setResume] = useState(null);
      const fileInputRef = useRef(null);

      const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
      };

      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setResume(file);
        }
      };

      const handleDragOver = (e) => {
        e.preventDefault();
      };

      const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
          setResume(file);
        }
      };
      
      const handleSubmit = (e) => {
        e.preventDefault();
        toast({
          title: "🚀 Application Submitted!",
          description: "Thank you for your interest. We will be in touch shortly.",
        });
        onClose();
        // Reset form
        setFormData({ fullName: '', email: '', phone: '' });
        setCoverLetter('');
        setResume(null);
      };

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[625px] bg-slate-900 border-slate-700 text-slate-200">
            <DialogHeader>
              <DialogTitle className="text-2xl text-lime-300">Apply for {jobTitle || 'a Position'}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Submit your application below. We're excited to learn more about you.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right text-slate-300">
                    Full Name
                  </Label>
                  <Input id="fullName" value={formData.fullName} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-600 text-white" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right text-slate-300">
                    Email
                  </Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-600 text-white" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right text-slate-300">
                    Phone
                  </Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-600 text-white" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="resume" className="text-right pt-2 text-slate-300">
                        Resume/CV
                    </Label>
                    <div className="col-span-3">
                        <div 
                            className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {resume ? (
                                <div className="text-center">
                                    <FileIcon className="mx-auto h-8 w-8 text-lime-400" />
                                    <p className="mt-2 text-sm text-slate-300">{resume.name}</p>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setResume(null); }}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-white"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
                                    <p className="mt-2 text-sm text-slate-400">
                                        <span className="font-semibold text-lime-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-slate-500">PDF, DOC, DOCX (MAX. 5MB)</p>
                                </div>
                            )}
                        </div>
                        <Input id="resume" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="coverLetter" className="text-right pt-2 text-slate-300">
                    Cover Letter
                  </Label>
                  <Textarea id="coverLetter" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Tell us why you're a great fit..." className="col-span-3 bg-slate-800 border-slate-600 text-white" rows={5} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-slate-900 font-bold">
                  Submit Application
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default ApplicationForm;