'use client';

import { Search, Filter } from 'lucide-react';

interface FiltersProps {
    activeTab: 'all' | 'staked' | 'unstaked';
    setActiveTab: (tab: 'all' | 'staked' | 'unstaked') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function CollectionFilters({ activeTab, setActiveTab, searchQuery, setSearchQuery }: FiltersProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            {/* Tabs */}
            <div className="flex bg-white/5 p-1 rounded-lg">
                {['all', 'staked', 'unstaked'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-md font-rajdhani font-bold capitalize transition-all cursor-pointer ${activeTab === tab
                            ? 'bg-primary text-black shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Sorting / Search */}
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                {/* <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-2">
           <Filter size={18} />
           <span className="hidden sm:inline">Sort</span>
         </button> */}
            </div>
        </div>
    );
}
