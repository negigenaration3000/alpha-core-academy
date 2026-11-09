import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#121D32]/50 border border-dashed border-[#26344D] rounded-2xl my-4">
      <div className="w-14 h-14 rounded-2xl bg-[#192641] border border-[#26344D] flex items-center justify-center text-[#38A5FF] mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-[#F8FAFC]">{title}</h3>
      <p className="text-xs text-[#94A3B8] max-w-sm mt-1 mb-5">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
