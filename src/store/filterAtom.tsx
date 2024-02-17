import type { TProviderInputType } from "@/lib/fetchers/getProviders";
import { atom } from "jotai";

const filterAtom = atom<TProviderInputType>({});
export const filterPageAtom = atom<number>(1);

export default filterAtom;
