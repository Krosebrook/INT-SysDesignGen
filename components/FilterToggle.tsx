import React from 'react';
import { RealityFilterType } from '../types';
import { REALITY_FILTER_LABELS, REALITY_FILTER_DESCRIPTIONS } from '../constants';
import { ShieldCheck, ShieldAlert, Check } from 'lucide-react';

interface FilterToggleProps {
  type: RealityFilterType;
  isActive: boolean;
  onToggle: (type: RealityFilterType) => void;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({ type, isActive, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(type)}
      className={`
        cursor-pointer rounded-lg border p-3 transition-all duration-200
        flex items-start gap-3 group select-none
        ${isActive 
          ? 'bg-blue-900/20 border-blue-500/50 hover:bg-blue-900/30' 
          : 'bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 hover:border-gray-600'}
      `}
    >
      <div className={`
        mt-0.5 rounded p-1 transition-colors
        ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}
      `}>
        {isActive ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className={`text-sm font-medium ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
            {REALITY_FILTER_LABELS[type]}
          </h4>
          {isActive && <Check size={14} className="text-blue-400" />}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          {REALITY_FILTER_DESCRIPTIONS[type]}
        </p>
      </div>
    </div>
  );
};