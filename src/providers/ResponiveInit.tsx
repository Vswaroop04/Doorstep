import tailwindConfig from '@/../tailwind.config';
import { OGresponsiveAtom } from '../store/responsive';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

const fullConfig = resolveConfig(tailwindConfig).theme!
	.screens! as any as Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', `${number}px`>;

const screens = Object.keys(fullConfig) as Array<
	'sm' | 'md' | 'lg' | 'xl' | '2xl'
>;

const ResponsiveInit = () => {
	const [responsive, setResponsive] = useAtom(OGresponsiveAtom);
	useEffect(() => {
		const mediaCalc = () => {
			// get current screen size
			const screenWidth = window.innerWidth;
			// use binary search to find the current breakpoint
			let start = 0;
			let end = screens.length - 1;
			let mid = Math.floor((start + end) / 2);
			while (start <= end) {
				if (parseInt(fullConfig[screens[mid]].split('px')[0]) > screenWidth) {
					end = mid - 1;
				} else {
					start = mid + 1;
				}
				mid = Math.floor((start + end) / 2);
			}
			if (responsive !== screens[mid]) setResponsive(screens[mid]);
			if (!(mid >= 0 && mid < screens.length)) {
				// set fallback as sm
				setResponsive('sm');
			}
		};
		// initial render
		mediaCalc();
		window.addEventListener('resize', mediaCalc, {
			passive: true,
		});
		return () => window.removeEventListener('resize', mediaCalc);
	}, [setResponsive, responsive]);
	return null;
};

export default ResponsiveInit;
