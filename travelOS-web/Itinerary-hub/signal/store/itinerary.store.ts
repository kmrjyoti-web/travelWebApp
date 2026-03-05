import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

import { buildItineraryForm } from "../signal-form/itinerary.form";
import { ItineraryRepository } from "../../data-access/repository/itinerary.repository";
import {ItineraryFormMapper} from "../signal-form/itinerary.form.mapper";

type State = {
    saving: boolean;
    error: any;
    form: ReturnType<typeof buildItineraryForm>;
};

const initialState: State = {
    saving: false,
    error: null,
    form: buildItineraryForm(),
};

export const ItineraryStore = signalStore(
    { providedIn: "root" },
    withState(initialState),

    withMethods((store) => {
        const repo = inject(ItineraryRepository);

        const patchText = (key: keyof State["form"], v: any) => {
            (store.form()[key] as any).set(v ?? null);
        };

        const patchNumber = (key: keyof State["form"], v: any) => {
            const n = v === "" || v === null || v === undefined ? null : Number(v);
            (store.form()[key] as any).set(Number.isFinite(n as any) ? n : null);
        };

        const submit = () => {
            patchState(store, { saving: true, error: null });

            const dto = ItineraryFormMapper.toCreateDto(store.form());

            repo.create(dto).subscribe({
                next: () => patchState(store, { saving: false }),
                error: (e) => patchState(store, { saving: false, error: e }),
            });
        };

        const resetForm = () => {
            patchState(store, { form: buildItineraryForm(), error: null });
        };

        return { patchText, patchNumber, submit, resetForm };
    })
);