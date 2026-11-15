'use client';

import {useState} from 'react';
import {Plus, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

/**
 * Editable list of short text items (ingredients). Type and press Enter or
 * "Add"; remove with the × on each chip. Commas add several at once.
 */
export function TagListField({
  id,
  value,
  onChange,
  placeholder,
  addLabel = 'Add'
}: {
  id: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const parts = draft
      .split(',')
      .map(part => part.trim())
      .filter(Boolean)
      .filter(part => !value.some(existing => existing.toLowerCase() === part.toLowerCase()));
    if (parts.length > 0) onChange([...value, ...parts].slice(0, 30));
    setDraft('');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          placeholder={placeholder}
          maxLength={80}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add} disabled={!draft.trim()}>
          <Plus aria-hidden="true" />
          {addLabel}
        </Button>
      </div>
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Added">
          {value.map(item => (
            <li
              key={item}
              className="inline-flex items-center gap-1 rounded-full border-2 border-ink/60 bg-linen py-1 pl-3 pr-1 text-base"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter(entry => entry !== item))}
                className="flex size-8 items-center justify-center rounded-full text-ink-soft hover:bg-tomato/10 hover:text-tomato"
                aria-label={`Remove ${item}`}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-soft">Nothing added yet.</p>
      )}
    </div>
  );
}
