
import logoutFunc from '@/lib/fetchers/auth/logout';
import { hasUserResolvedAtom } from '@/lib/providers/UserInit';
import globalLoadingAtom from '@/store/loading';
import userAtom from '@/store/User';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

const isLoggedInAtom = atom((get) => !!get(userAtom));

function useUser() {
	const router = useRouter();
	const [user, setUser] = useAtom(userAtom);
	const isLoggedIn = useAtomValue(isLoggedInAtom);
	const hasUserResolved = useAtomValue(hasUserResolvedAtom);
	const setIsLoading = useSetAtom(globalLoadingAtom);
	const logout = async () => {
		try {
			setIsLoading({
				isLoading: true,
				reason: 'Logging out...',
			});
      router.push('/');
			await logoutFunc();
			setUser(undefined);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	return {
		user,
		setUser,
		isLoggedIn,
		logout,
		hasUserResolved,
	};
}

export default useUser;
