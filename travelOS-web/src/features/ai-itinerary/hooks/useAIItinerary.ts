import { useApiQuery, useApiMutation } from '@/shared/hooks/useApiQuery';
import { aiItineraryService } from '@/shared/services/ai-itinerary.service';
import type {
  GenerateAIItineraryParams,
  AIRequestStatusResult,
  AIItineraryDraft,
  EditDraftParams,
  ConvertDraftResult,
} from '@/shared/services/ai-itinerary.service';
import type { ApiResponse } from '@/shared/types/api.types';

export function useAIRequestStatus(requestId: string | null) {
  return useApiQuery<AIRequestStatusResult>(
    ['ai-itinerary', 'status', requestId],
    () => aiItineraryService.getStatus(requestId!),
    {
      enabled: !!requestId,
      // query.state.data is TQueryFnData (ApiResponse<...>) at refetchInterval callback
      refetchInterval: (query) => {
        const raw = query.state.data as ApiResponse<AIRequestStatusResult> | undefined;
        const status = raw?.data?.status;
        return status === 'pending' || status === 'generating' ? 3000 : false;
      },
    },
  );
}

export function useAIDraft(draftId: string | null) {
  return useApiQuery<AIItineraryDraft>(
    ['ai-itinerary', 'draft', draftId],
    () => aiItineraryService.getDraft(draftId!),
    { enabled: !!draftId },
  );
}

export function useGenerateAIItinerary(options?: { onSuccess?: (requestId: string) => void }) {
  return useApiMutation<{ requestId: string }, GenerateAIItineraryParams>(
    (params) => aiItineraryService.generate(params),
    {
      onSuccess: (res) => {
        options?.onSuccess?.(res.data.requestId);
      },
    },
  );
}

export function useEditDraft(options?: { onSuccess?: (draft: AIItineraryDraft) => void }) {
  return useApiMutation<AIItineraryDraft, { draftId: string; params: EditDraftParams }>(
    ({ draftId, params }) => aiItineraryService.editDraft(draftId, params),
    { onSuccess: (res) => options?.onSuccess?.(res.data) },
  );
}

export function useConvertDraft(options?: { onSuccess?: (result: ConvertDraftResult) => void }) {
  return useApiMutation<ConvertDraftResult, string>(
    (draftId) => aiItineraryService.convertToFork(draftId),
    { onSuccess: (res) => options?.onSuccess?.(res.data) },
  );
}
