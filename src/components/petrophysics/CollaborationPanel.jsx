import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
    Users, Activity, MessageSquare, GitBranch, UserPlus, 
    Send, Hash, Bell, BookOpen, Edit3, Save, Search, 
    MoreHorizontal, FileText, Check, Trash2, Plus
} from 'lucide-react';
import { usePetrophysicsCollaboration } from './hooks/usePetrophysicsCollaboration';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

const CollaborationPanel = ({ petroState }) => {
    const { toast } = useToast();
    const { projectId } = petroState;
    const {
        userRole,
        team,
        activityLog,
        channels,
        messages,
        activeChannelId,
        setActiveChannelId,
        sendMessage,
        createChannel,
        notifications,
        markNotificationRead,
        wikiPages,
        saveWikiPage,
        fetchTeam,
        addMember,
        removeMember,
        fetchActivity,
        fetchChannels,
        fetchNotifications,
        fetchWiki
    } = usePetrophysicsCollaboration(projectId, toast);

    // Local State
    const [messageInput, setMessageInput] = useState('');
    const [newChannelName, setNewChannelName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('viewer');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isChannelOpen, setIsChannelOpen] = useState(false);
    
    // Wiki State
    const [activeWikiSlug, setActiveWikiSlug] = useState(null);
    const [isEditingWiki, setIsEditingWiki] = useState(false);
    const [wikiTitle, setWikiTitle] = useState('');
    const [wikiContent, setWikiContent] = useState('');
    const [wikiCategory, setWikiCategory] = useState('guidelines');

    // Initialization
    useEffect(() => {
        if (projectId) {
            fetchTeam();
            fetchActivity();
            fetchChannels();
            fetchNotifications();
            fetchWiki();
        }
    }, [projectId]);

    // Auto-scroll chat
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handlers
    const handleSendMessage = async () => {
        if (!messageInput.trim()) return;
        await sendMessage(messageInput);
        setMessageInput('');
    };

    const handleCreateChannel = async () => {
        if (!newChannelName.trim()) return;
        await createChannel(newChannelName, 'Project channel');
        setNewChannelName('');
        setIsChannelOpen(false);
    };

    const handleInvite = async () => {
        if (!inviteEmail.trim()) return;
        await addMember(inviteEmail, inviteRole);
        setInviteEmail('');
        setIsInviteOpen(false);
    };

    const handleSaveWiki = async () => {
        if (!wikiTitle.trim()) return;
        await saveWikiPage(wikiTitle, wikiContent, wikiCategory);
        setIsEditingWiki(false);
        setActiveWikiSlug(wikiTitle.toLowerCase().replace(/ /g, '-'));
    };

    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : '??';

    if (!projectId) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-950/50 border border-slate-800 m-4 rounded-xl">
                <div className="text-center text-slate-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-slate-300">Collaboration Hub</h3>
                    <p>Please save your project to enable team features.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col lg:flex-row bg-slate-950 overflow-hidden">
            
            {/* Sidebar (Channels, Team, Wiki List) */}
            <div className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" /> 
                        Team Hub
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 truncate">{petroState.projectName || 'Untitled Project'}</p>
                </div>

                <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                    <div className="px-2 pt-2">
                        <TabsList className="w-full bg-slate-800">
                            <TabsTrigger value="chat" className="flex-1"><MessageSquare className="w-4 h-4"/></TabsTrigger>
                            <TabsTrigger value="wiki" className="flex-1"><BookOpen className="w-4 h-4"/></TabsTrigger>
                            <TabsTrigger value="team" className="flex-1"><Users className="w-4 h-4"/></TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Chat Channels List */}
                    <TabsContent value="chat" className="flex-1 flex flex-col mt-0 min-h-0">
                        <div className="p-3">
                            <div className="flex justify-between items-center mb-2 px-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Channels</span>
                                <Dialog open={isChannelOpen} onOpenChange={setIsChannelOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-400 hover:text-white"><Plus className="w-3 h-3"/></Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-slate-900 border-slate-800">
                                        <DialogHeader><DialogTitle>Create Channel</DialogTitle></DialogHeader>
                                        <div className="space-y-4 pt-4">
                                            <div className="space-y-2">
                                                <Label>Channel Name</Label>
                                                <Input value={newChannelName} onChange={e=>setNewChannelName(e.target.value)} placeholder="e.g. interpretation-phase-1" className="bg-slate-950"/>
                                            </div>
                                            <Button onClick={handleCreateChannel}>Create</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="space-y-1">
                                {channels.map(channel => (
                                    <button
                                        key={channel.id}
                                        onClick={() => setActiveChannelId(channel.id)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${activeChannelId === channel.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    >
                                        <Hash className="w-3 h-3 opacity-50" />
                                        {channel.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mt-auto p-3 border-t border-slate-800">
                            <span className="text-xs font-bold text-slate-400 uppercase px-2 block mb-2">Recent Activity</span>
                            <ScrollArea className="h-32">
                                {activityLog.slice(0, 5).map((log, i) => (
                                    <div key={i} className="px-2 py-1.5 text-xs border-l-2 border-slate-800 ml-1 mb-1">
                                        <p className="text-slate-300 truncate">{log.description}</p>
                                        <span className="text-slate-500 text-[10px]">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </TabsContent>

                    {/* Wiki Pages List */}
                    <TabsContent value="wiki" className="flex-1 flex flex-col mt-0 min-h-0 p-3">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Knowledge Base</span>
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-400 hover:text-white" onClick={() => {
                                setWikiTitle('');
                                setWikiContent('');
                                setIsEditingWiki(true);
                                setActiveWikiSlug(null);
                            }}>
                                <Plus className="w-3 h-3"/>
                            </Button>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="space-y-1">
                                {wikiPages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => { setActiveWikiSlug(page.slug); setIsEditingWiki(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${activeWikiSlug === page.slug ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    >
                                        <FileText className="w-3 h-3 opacity-50" />
                                        <span className="truncate">{page.title}</span>
                                    </button>
                                ))}
                                {wikiPages.length === 0 && <p className="text-center text-xs text-slate-500 py-4">No pages yet.</p>}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* Team List */}
                    <TabsContent value="team" className="flex-1 flex flex-col mt-0 min-h-0 p-3">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Members ({team.length})</span>
                            {['owner','admin'].includes(userRole) && (
                                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-400 hover:text-white"><UserPlus className="w-3 h-3"/></Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-slate-900 border-slate-800">
                                        <DialogHeader><DialogTitle>Add Member</DialogTitle></DialogHeader>
                                        <div className="space-y-4 pt-4">
                                            <Input placeholder="Email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} className="bg-slate-950"/>
                                            <Select value={inviteRole} onValueChange={setInviteRole}>
                                                <SelectTrigger className="bg-slate-950"><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="viewer">Viewer</SelectItem>
                                                    <SelectItem value="editor">Editor</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={handleInvite}>Invite</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="space-y-2">
                                {team.map(member => (
                                    <div key={member.id} className="flex items-center gap-3 px-2 py-2 hover:bg-slate-800/50 rounded-md group">
                                        <Avatar className="h-8 w-8 border border-slate-700">
                                            <AvatarFallback className="bg-slate-800 text-xs">{getInitials(member.email)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm text-white truncate">{member.email?.split('@')[0]}</p>
                                            <p className="text-[10px] text-slate-500 capitalize">{member.role}</p>
                                        </div>
                                        {['owner','admin'].includes(userRole) && member.role !== 'owner' && (
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400" onClick={() => removeMember(member.id)}>
                                                <Trash2 className="w-3 h-3"/>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Main Content Area (Chat or Wiki) */}
            <div className="flex-1 flex flex-col relative bg-slate-950">
                
                {/* Top Bar: Notifications & Context */}
                <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50 backdrop-blur">
                    <div className="flex items-center gap-2 text-slate-200 font-medium">
                        {activeWikiSlug ? (
                            <>
                                <BookOpen className="w-4 h-4 text-emerald-500" />
                                {wikiPages.find(p => p.slug === activeWikiSlug)?.title || 'New Page'}
                            </>
                        ) : (
                            <>
                                <Hash className="w-4 h-4 text-blue-500" />
                                {channels.find(c => c.id === activeChannelId)?.name || 'Select Channel'}
                            </>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                                    <Bell className="w-5 h-5" />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-slate-800 max-w-md h-[400px] flex flex-col">
                                <DialogHeader><DialogTitle>Notifications</DialogTitle></DialogHeader>
                                <ScrollArea className="flex-1">
                                    {notifications.length === 0 ? (
                                        <p className="text-center text-slate-500 py-8">No new notifications.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {notifications.map(notif => (
                                                <div key={notif.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex gap-3">
                                                    <div className="mt-1"><Bell className="w-4 h-4 text-blue-400"/></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-slate-200 font-medium">{notif.title}</p>
                                                        <p className="text-xs text-slate-400">{notif.message}</p>
                                                        <p className="text-[10px] text-slate-500 mt-1">{formatDistanceToNow(new Date(notif.created_at))} ago</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={()=>markNotificationRead(notif.id)}><Check className="w-3 h-3"/></Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                        
                        <div className="h-8 w-[1px] bg-slate-800"></div>
                        
                        <Badge variant="outline" className="border-slate-700 text-slate-400 capitalize">
                            {userRole || 'Guest'}
                        </Badge>
                    </div>
                </div>

                {/* Content Area Switcher */}
                {activeWikiSlug || isEditingWiki ? (
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-950">
                        {isEditingWiki ? (
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">Edit Wiki Page</h2>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" onClick={() => { setIsEditingWiki(false); setActiveWikiSlug(null); }}>Cancel</Button>
                                        <Button onClick={handleSaveWiki} className="bg-emerald-600 hover:bg-emerald-500">Save Page</Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Title</Label>
                                        <Input value={wikiTitle} onChange={e => setWikiTitle(e.target.value)} className="bg-slate-900 border-slate-700 text-lg" placeholder="Page Title" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Category</Label>
                                        <Select value={wikiCategory} onValueChange={setWikiCategory}>
                                            <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="guidelines">Guidelines</SelectItem>
                                                <SelectItem value="interpretation">Interpretation</SelectItem>
                                                <SelectItem value="best_practices">Best Practices</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Content (Markdown supported)</Label>
                                        <Textarea value={wikiContent} onChange={e => setWikiContent(e.target.value)} className="bg-slate-900 border-slate-700 min-h-[400px] font-mono" placeholder="# Heading..." />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto">
                                {(() => {
                                    const page = wikiPages.find(p => p.slug === activeWikiSlug);
                                    if (!page) return <p className="text-center text-slate-500">Page not found.</p>;
                                    return (
                                        <article className="prose prose-invert max-w-none">
                                            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                                                <div>
                                                    <h1 className="text-3xl font-bold text-white mb-2">{page.title}</h1>
                                                    <div className="flex gap-2">
                                                        <Badge variant="secondary" className="text-xs">{page.category}</Badge>
                                                        <span className="text-xs text-slate-500 flex items-center">Updated {formatDistanceToNow(new Date(page.updated_at))} ago</span>
                                                    </div>
                                                </div>
                                                {['owner','admin','editor'].includes(userRole) && (
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        setWikiTitle(page.title);
                                                        setWikiContent(page.content);
                                                        setWikiCategory(page.category);
                                                        setIsEditingWiki(true);
                                                    }}>
                                                        <Edit3 className="w-4 h-4 mr-2" /> Edit
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                                                {page.content}
                                            </div>
                                        </article>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                ) : (
                    // Chat View
                    <>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {messages.map((msg) => {
                                    const isMe = false; // Replace with auth check if ID available
                                    return (
                                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <Avatar className="h-8 w-8 mt-1">
                                                <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">
                                                    {getInitials(team.find(t=>t.user_id===msg.user_id)?.email || 'U')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className={`max-w-[80%] ${isMe ? 'bg-blue-600' : 'bg-slate-800'} rounded-lg p-3 text-sm text-slate-200`}>
                                                <div className="flex justify-between gap-4 mb-1">
                                                    <span className={`font-bold text-xs ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                                        {team.find(t=>t.user_id===msg.user_id)?.email?.split('@')[0] || 'User'}
                                                    </span>
                                                    <span className="text-[10px] opacity-50">{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}</span>
                                                </div>
                                                <p>{msg.content}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {messages.length === 0 && (
                                    <div className="text-center py-12 text-slate-600">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                            <div className="max-w-4xl mx-auto flex gap-2">
                                <Input 
                                    value={messageInput}
                                    onChange={e => setMessageInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={`Message #${channels.find(c=>c.id===activeChannelId)?.name || 'channel'}...`}
                                    className="bg-slate-900 border-slate-700 focus-visible:ring-blue-500"
                                />
                                <Button onClick={handleSendMessage} size="icon" className="bg-blue-600 hover:bg-blue-500">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CollaborationPanel;