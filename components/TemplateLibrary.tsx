import React, { useState, useEffect } from 'react';
import { ProjectTemplate } from '../types';
import { PROJECT_TEMPLATES } from '../constants';
import { 
  Search, Play, ShoppingCart, Shield, Lock, Server, Zap, 
  Database, Box, Briefcase, FileText, Smartphone, Brain, 
  Target, Clock, AlertTriangle, Key, Eye, Terminal, 
  TrendingUp, Share2, Bell, Map, Layout, Globe, Tag,
  Users, Calendar, Truck, Factory, Wrench
} from 'lucide-react';

interface TemplateLibraryProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
}

const ICONS: Record<string, any> = {
  ShoppingCart, Shield, Lock, Server, Zap, Play,
  Database, Box, Briefcase, FileText, Smartphone, Brain,
  Target, Clock, AlertTriangle, Key, Eye, Terminal,
  TrendingUp, Share2, Bell, Map, Layout, Globe,
  Users, Calendar, Truck, Factory, Wrench
};

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectTemplate }) => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const filteredTemplates = PROJECT_TEMPLATES.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Architecture Templates</h2>
        <p className="text-gray-400 mb-8">
          Accelerate your system design with battle-tested patterns for common enterprise scenarios.
        </p>
        
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search templates (e.g. 'Microservices', 'Auth', 'IoT')..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 pl-12 pr-6 text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none shadow-xl transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {filteredTemplates.map((template) => {
          const Icon = ICONS[template.icon] || Box;
          return (
            <div 
              key={template.id} 
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 hover:shadow-2xl hover:shadow-blue-900/10 transition-all group flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 group-hover:border-blue-500/50 group-hover:bg-blue-900/10 transition-colors">
                        <Icon size={24} className="text-blue-400" />
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${
                        template.difficulty === 'Advanced' ? 'border-red-900/50 text-red-400 bg-red-900/10' :
                        template.difficulty === 'Intermediate' ? 'border-yellow-900/50 text-yellow-400 bg-yellow-900/10' :
                        'border-green-900/50 text-green-400 bg-green-900/10'
                    }`}>
                        {template.difficulty}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{template.title}</h3>
                <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {template.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-950 px-2 py-1 rounded flex items-center gap-1">
                            <Tag size={10} />
                            {tag}
                        </span>
                    ))}
                    {template.tags.length > 3 && (
                        <span className="text-xs text-gray-500 bg-gray-950 px-2 py-1 rounded flex items-center">
                           +{template.tags.length - 3}
                        </span>
                    )}
                </div>
              </div>

              <div className="p-4 border-t border-gray-800 bg-gray-950/50">
                 <button 
                    onClick={() => onSelectTemplate(template)}
                    className="w-full py-2 bg-gray-800 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm group-hover:shadow-lg"
                 >
                    <Play size={16} />
                    Load Template
                 </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-gray-800 mb-4">
                  <Search size={32} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-300">No templates found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
          </div>
      )}
    </div>
  );
};