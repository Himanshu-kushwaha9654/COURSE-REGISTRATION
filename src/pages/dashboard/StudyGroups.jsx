import React, { useState } from 'react';
import { Users, Search, Plus, MessageSquare, BookOpen, Star, MoreVertical, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudyGroups() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my_groups'
  const [selectedGroup, setSelectedGroup] = useState(null);

  const mockGroups = [
    { id: 1, name: 'CS101 Late Night Grinders', course: 'Introduction to Computer Science', members: 42, maxMembers: 50, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=cs101', active: true, joined: true },
    { id: 2, name: 'Data Structures Wizards', course: 'Data Structures and Algorithms', members: 128, maxMembers: 200, avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=dsa', active: false, joined: false },
    { id: 3, name: 'Web Dev Front-End', course: 'Web Development', members: 15, maxMembers: 25, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=webdev', active: true, joined: true },
    { id: 4, name: 'Database Architecture Pros', course: 'Database Management Systems', members: 89, maxMembers: 100, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dbms', active: false, joined: false },
    { id: 5, name: 'Machine Learning Study Hub', course: 'Intro to Machine Learning', members: 210, maxMembers: 300, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ml', active: true, joined: false },
    { id: 6, name: 'OS Kernel Hackers', course: 'Operating Systems', members: 34, maxMembers: 50, avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=os', active: false, joined: true },
  ];

  const filteredGroups = mockGroups.filter(g => 
    (activeTab === 'all' || (activeTab === 'my_groups' && g.joined)) &&
    (g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.course.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-2">
      {/* Left Sidebar - Group List */}
      <div className={`w-full ${selectedGroup ? 'hidden md:flex' : 'flex'} md:w-1/3 flex-col gap-6`}>
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-500" />
            Study Groups
          </h1>
          <p className="opacity-50 text-[var(--text-color)] text-sm">Connect, collaborate, and conquer your courses together.</p>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search groups or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
          
          <div className="flex p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-indigo-500 text-white shadow-md' : 'opacity-60 hover:opacity-100'}`}
            >
              Discover
            </button>
            <button 
              onClick={() => setActiveTab('my_groups')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'my_groups' ? 'bg-indigo-500 text-white shadow-md' : 'opacity-60 hover:opacity-100'}`}
            >
              My Groups
            </button>
          </div>
        </div>

        {/* Create Group Button */}
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <Plus className="w-4 h-4" /> Create New Group
        </button>

        {/* Group List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredGroups.map(group => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedGroup?.id === group.id ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/40' : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-indigo-500/30 hover:bg-[var(--glass-border)]'}`}
            >
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 p-1 border border-[var(--glass-border)] overflow-hidden">
                    <img src={group.avatar} alt="Group avatar" className="w-full h-full object-cover" />
                  </div>
                  {group.active && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[var(--bg-color)]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{group.name}</h3>
                  <p className="text-xs opacity-60 truncate flex items-center gap-1 mt-0.5">
                    <BookOpen className="w-3 h-3" /> {group.course}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--glass-border)]">
                <span className="text-[10px] font-bold opacity-50 uppercase bg-[var(--glass-bg)] px-2 py-1 rounded-md">
                  {group.members} / {group.maxMembers} Members
                </span>
                {group.joined && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Joined
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Chat Interface Mockup */}
      {selectedGroup ? (
        <div className="w-full md:flex-1 h-full glass-panel rounded-3xl border border-[var(--glass-border)] flex flex-col overflow-hidden relative">
           {/* Chat Header */}
           <div className="h-20 border-b border-[var(--glass-border)] px-6 flex items-center justify-between shrink-0 bg-[var(--glass-bg)] z-10 backdrop-blur-md">
             <div className="flex items-center gap-4">
               <button onClick={() => setSelectedGroup(null)} className="md:hidden opacity-50 hover:opacity-100 p-2 -ml-2">
                 <MoreVertical className="w-5 h-5 rotate-90" />
               </button>
               <div className="w-10 h-10 rounded-full bg-slate-800 p-1 border border-[var(--glass-border)] overflow-hidden">
                  <img src={selectedGroup.avatar} alt="Group avatar" className="w-full h-full object-cover" />
               </div>
               <div>
                 <h2 className="font-bold">{selectedGroup.name}</h2>
                 <p className="text-xs opacity-50 flex items-center gap-1">
                   {selectedGroup.members} Members • {selectedGroup.active ? <span className="text-emerald-400">Active Now</span> : 'Offline'}
                 </p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               {!selectedGroup.joined ? (
                 <button className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 transition-all">
                   Join Group
                 </button>
               ) : (
                 <button className="p-2 rounded-xl bg-[var(--glass-border)] opacity-60 hover:opacity-100 transition-all">
                   <Star className="w-4 h-4" />
                 </button>
               )}
               <button className="p-2 rounded-xl bg-[var(--glass-border)] opacity-60 hover:opacity-100 transition-all hidden sm:block">
                 <MoreVertical className="w-4 h-4" />
               </button>
             </div>
           </div>

           {/* Chat Messages Mockup */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                 <Users className="w-64 h-64" />
              </div>
              
              <div className="text-center">
                 <span className="text-xs font-bold opacity-40 bg-[var(--glass-border)] px-3 py-1 rounded-full uppercase">Today</span>
              </div>
              
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-orange-400 flex items-center justify-center text-xs font-bold text-white shrink-0">A</div>
                 <div className="max-w-[80%]">
                    <div className="flex items-baseline gap-2 mb-1">
                       <span className="text-sm font-bold">Alice Johnson</span>
                       <span className="text-[10px] opacity-40">10:42 AM</span>
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm shadow-sm">
                       Hey everyone! Is anyone else struggling with the final project requirements for this course?
                    </div>
                 </div>
              </div>

              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 flex items-center justify-center text-xs font-bold text-white shrink-0">B</div>
                 <div className="max-w-[80%]">
                    <div className="flex items-baseline gap-2 mb-1">
                       <span className="text-sm font-bold">Bob Smith</span>
                       <span className="text-[10px] opacity-40">10:45 AM</span>
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-sm bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm shadow-sm">
                       Yeah, I'm a bit confused about the database schema part. Want to jump on a quick call later?
                    </div>
                 </div>
              </div>
              
              <div className="flex gap-3 flex-row-reverse">
                 <div className="max-w-[80%] flex flex-col items-end">
                    <div className="flex items-baseline gap-2 mb-1">
                       <span className="text-[10px] opacity-40">10:50 AM</span>
                    </div>
                    <div className="p-3 rounded-2xl rounded-tr-sm bg-gradient-to-br from-indigo-500 to-cyan-500 text-white text-sm shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                       I've actually finished that section. I can share some notes if it helps!
                    </div>
                 </div>
              </div>
           </div>

           {/* Chat Input */}
           <div className="p-4 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] shrink-0 z-10 backdrop-blur-md">
             {selectedGroup.joined ? (
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    placeholder={`Message ${selectedGroup.name}...`}
                    className="w-full bg-[var(--bg-color)] border border-[var(--glass-border)] rounded-full py-3.5 pl-6 pr-14 text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                  />
                  <button className="absolute right-2 w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
             ) : (
                <div className="text-center py-4 opacity-50 text-sm flex items-center justify-center gap-2">
                   <MessageSquare className="w-4 h-4" /> You must join this group to send messages.
                </div>
             )}
           </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 glass-panel rounded-3xl border border-[var(--glass-border)] flex-col items-center justify-center text-center p-8">
           <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
              <Users className="w-10 h-10 text-indigo-400" />
           </div>
           <h2 className="text-2xl font-bold mb-3">Select a Study Group</h2>
           <p className="opacity-50 max-w-sm">Choose a group from the sidebar to view discussions, share notes, and collaborate with your peers.</p>
        </div>
      )}
    </div>
  );
}
