'use client';
/**
 * FaqEditor — repeater component for managing FAQ question/answer pairs.
 * Supports AI generation via the useGeoFaqGenerate hook.
 */
import React from 'react';
import { TextField, TextareaField, Button } from '@/shared/components';
import { Icon } from '@/shared/components/Icon';
import { useGeoFaqGenerate } from './hooks/useGeoFaqGenerate';
import type { FaqItem } from './types';

const MAX_FAQS = 10;

interface FaqEditorProps {
  itineraryId: string;
  value: FaqItem[];
  onChange: (faqs: FaqItem[]) => void;
}

export function FaqEditor({ itineraryId, value, onChange }: FaqEditorProps) {
  const { generateFaqs, isGenerating } = useGeoFaqGenerate(itineraryId);

  const handleAddFaq = () => {
    if (value.length >= MAX_FAQS) return;
    onChange([...value, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleChange = (idx: number, field: keyof FaqItem, val: string) => {
    const updated = value.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item,
    );
    onChange(updated);
  };

  const handleAiGenerate = async () => {
    try {
      const faqs = await generateFaqs();
      const merged = [...value, ...faqs].slice(0, MAX_FAQS);
      onChange(merged);
    } catch {
      console.error('Failed to generate FAQs');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button
          color="secondary"
          size="sm"
          onClick={handleAiGenerate}
          disabled={isGenerating || value.length >= MAX_FAQS}
          aria-label="Generate FAQs with AI"
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <Icon name="Sparkles" size={14} />
              AI Generate FAQs
            </>
          )}
        </Button>
      </div>

      {/* FAQ list */}
      {value.length === 0 && (
        <p style={{ color: 'var(--cui-secondary-color)', fontSize: '0.875rem', textAlign: 'center', padding: 16 }}>
          No FAQs added yet. Add manually or use AI generation.
        </p>
      )}

      {value.map((faq, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 12,
            border: '1px solid var(--cui-border-color)',
            borderRadius: 8,
            background: 'var(--cui-tertiary-bg, rgba(0,0,0,0.02))',
            position: 'relative',
          }}
          aria-label={`FAQ item ${idx + 1}`}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cui-secondary-color)' }}>
              FAQ #{idx + 1}
            </span>
            <button
              type="button"
              aria-label={`Remove FAQ ${idx + 1}`}
              onClick={() => handleRemoveFaq(idx)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--cui-danger)',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <Icon name="Trash2" size={16} />
            </button>
          </div>

          <TextField
            label="Question"
            size="xs"
            value={faq.question}
            onChange={(e) => handleChange(idx, 'question', e.target.value)}
            placeholder="e.g. What is included in this tour?"
            aria-label={`FAQ ${idx + 1} question`}
          />

          <TextareaField
            label="Answer"
            size="sm"
            value={faq.answer}
            onChange={(e) => handleChange(idx, 'answer', e.target.value)}
            placeholder="Provide a concise, helpful answer..."
            minRows={2}
            aria-label={`FAQ ${idx + 1} answer`}
          />
        </div>
      ))}

      {/* Add FAQ button */}
      {value.length < MAX_FAQS && (
        <Button
          color="light"
          size="sm"
          onClick={handleAddFaq}
          aria-label="Add FAQ"
          style={{ alignSelf: 'flex-start' }}
        >
          <Icon name="Plus" size={14} />
          Add FAQ
        </Button>
      )}

      {value.length >= MAX_FAQS && (
        <p style={{ fontSize: '0.75rem', color: 'var(--cui-warning)', margin: 0 }}>
          Maximum of {MAX_FAQS} FAQs reached.
        </p>
      )}
    </div>
  );
}
