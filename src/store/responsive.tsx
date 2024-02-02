import { atom } from 'jotai';

const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'] as (
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
)[];

export const OGresponsiveAtom = atom<
	'sm' | 'md' | 'lg' | 'xl' | '2xl' | undefined
>(undefined);
OGresponsiveAtom.debugLabel = 'OGResponsiveAtom';

export const responsiveAtom = atom<
	Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', boolean>
>((get) => {
	const responsive = get(OGresponsiveAtom);
	if (!responsive)
		return {
			sm: false,
			md: false,
			lg: false,
			xl: false,
			'2xl': false,
		};
	let isBreakpoint = true;
	return breakpoints.reduce(
		(acc, breakpoint) => {
			acc[breakpoint] = isBreakpoint;
			if (responsive === breakpoint) isBreakpoint = false;
			return acc;
		},
		{} as Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', boolean>,
	);
});
responsiveAtom.debugLabel = 'ResponsiveAtom';
	