/**
 * React Query mutation hook for generating AI FAQs for an itinerary.
 */
import { useState } from 'react';
import { useApiMutation } from '@/shared/hooks/useApiQuery';
import { geoService } from '../geoService';
import type { FaqItem } from '../types';

interface UseGeoFaqGenerateResult {
  generateFaqs: () => Promise<FaqItem[]>;
  isGenerating: boolean;
  generatedFaqs: FaqItem[];
}

export function useGeoFaqGenerate(itineraryId: string): UseGeoFaqGenerateResult {
  const [generatedFaqs, setGeneratedFaqs] = useState<FaqItem[]>([]);

  const { mutateAsync, isPending: isGenerating } = useApiMutation<
    { faqs: FaqItem[] },
    void
  >(
    () => geoService.generateFaqs(itineraryId) as never,
  );

  const generateFaqs = async (): Promise<FaqItem[]> => {
    const result = await mutateAsync(undefined);
    const faqs = result.data?.faqs ?? [];
    setGeneratedFaqs(faqs);
    return faqs;
  };

  return { generateFaqs, isGenerating, generatedFaqs };
}
