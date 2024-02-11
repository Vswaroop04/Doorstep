import TAuth from '../types/authType';
import { atom } from 'jotai';

export const authAtom = atom<Partial<TAuth> | undefined>(undefined);
authAtom.debugLabel = 'authAtom';

export default authAtom;
