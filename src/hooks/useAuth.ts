import authAtom from "@/lib/store/AuthType";
import { atom, useAtom, useAtomValue } from 'jotai';

const isLoggedInAtom = atom((get) => !!get(authAtom));
function useAuth() {
	const [auth, setAuth] = useAtom(authAtom);
	const isLoggedIn = useAtomValue(isLoggedInAtom);
	return {
		auth,
		setAuth,
		isLoggedIn,
	};
}

export default useAuth;
