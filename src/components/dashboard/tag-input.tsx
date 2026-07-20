'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface Props {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagInput({ label, values, onChange, placeholder = 'Type and press Enter' }: Props) {
  const [draft, setDraft] = useState('');

  function addValue() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addValue();
    }
  }

  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <div className="input-field flex flex-wrap gap-1.5 items-center min-h-[2.75rem] py-1.5">
        {values.map((value) => (
          <span key={value} className="badge gap-1.5 pr-1">
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((v) => v !== value))}
              className="hover:text-danger"
              aria-label={`Remove ${value}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addValue}
          placeholder={values.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1"
        />
        <button type="button" onClick={addValue} aria-label="Add" className="text-muted-foreground hover:text-accent">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
