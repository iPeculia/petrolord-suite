import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ArticleManagement = () => {
    const articles = [
        { title: 'Configuring SSO with Azure AD', author: 'Admin', status: 'Published', updated: '2h ago' },
        { title: 'Seismic Attribute Analysis Guide', author: 'Geo Lead', status: 'Draft', updated: '5h ago' },
        { title: 'Well Correlation Best Practices', author: 'User', status: 'Review', updated: '1d ago' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200">Article Manager</h3>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Title</TableHead>
                                <TableHead className="text-slate-400">Author</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.map((art, i) => (
                                <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                    <TableCell className="font-medium text-slate-200">{art.title}</TableCell>
                                    <TableCell className="text-slate-400 text-xs">{art.author}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`text-[10px] ${
                                            art.status === 'Published' ? 'text-green-400 border-green-900' : 
                                            art.status === 'Draft' ? 'text-slate-400 border-slate-700' : 
                                            'text-yellow-400 border-yellow-900'
                                        }`}>{art.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Eye className="w-4 h-4 text-slate-500 hover:text-blue-400 cursor-pointer" />
                                            <Edit className="w-4 h-4 text-slate-500 hover:text-green-400 cursor-pointer" />
                                            <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-400 cursor-pointer" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ArticleManagement;