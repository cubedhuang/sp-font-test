import { browser } from '$app/environment';
import { type Writable, writable } from 'svelte/store';

function savedWritable<T>(
	key: string,
	initialValue: T,
	validator?: (value: T) => boolean
): Writable<T> {
	const { subscribe, set, update } = writable(initialValue);

	if (browser) {
		const json = localStorage.getItem(key);
		if (json !== null && (!validator || validator(JSON.parse(json)))) {
			set(JSON.parse(json));
		}
	}

	return {
		subscribe,
		set(value: T) {
			if (browser) {
				localStorage.setItem(key, JSON.stringify(value));
			}
			set(value);
		},
		update
	};
}

export const rawWords = savedWritable<string>(
	'words',
	'',
	value => typeof value === 'string'
);
