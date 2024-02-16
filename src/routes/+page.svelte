<script lang="ts">
	import { onMount } from 'svelte';

	const removedWords = [
		'anu',
		'e',
		'en',
		'la',
		'li',
		'pi',
		'kiki',
		'linluwi',
		'oke',
		'omekapo',
		'nimisin',
		'usawi',
		'wuwojiti',
		'yupekosi'
	];

	let before = '';
	let separator = '+';
	let after = '';

	let rawWords = '';

	$: words = rawWords.split('\n');

	onMount(async () => {
		const data = (await fetch(
			'https://raw.githubusercontent.com/lipu-linku/jasima/main/data.json'
		).then(res => res.json())) as {
			data: Record<
				string,
				{
					word: string;
					usage_category: string;
					book: string;
				}
			>;
		};

		rawWords = Object.values(data.data)
			.filter(
				word =>
					word.usage_category === 'core' ||
					word.usage_category === 'widespread' ||
					word.usage_category === 'common' ||
					word.usage_category === 'uncommon' ||
					word.book === 'ku suli'
			)
			.filter(word => !removedWords.includes(word.word))
			.map(word => word.word)
			.join('\n');
	});

	let constantWord = 'ijo';
	let varyFirstWord = false;

	$: output = words.map(word => {
		if (varyFirstWord) {
			return `${before}${word}${separator}${constantWord}${after}`;
		} else {
			return `${before}${constantWord}${separator}${word}${after}`;
		}
	});
</script>

<svelte:head>
	<title>nasin nanpa combo playground</title>
</svelte:head>

<div class="mt-20 max-w-screen-lg mx-auto px-8">
	<h1 class="font-bold text-4xl">nasin nanpa combo playground</h1>

	<div class="mt-4 flex items-baseline">
		<input
			type="text"
			bind:value={before}
			class="input px-2 py-1 w-12 text-center"
		/>

		<p class="mx-2">first word</p>

		<input
			type="text"
			bind:value={separator}
			class="input px-2 py-1 w-12 text-center"
		/>

		<p class="mx-2">second word</p>

		<input
			type="text"
			bind:value={after}
			class="input px-2 py-1 w-12 text-center"
		/>
	</div>

	<textarea class="mt-4 input h-32 w-full p-4" bind:value={rawWords}
	></textarea>

	<div class="mt-4 flex">
		<select
			class="input px-4 py-1 cursor-pointer"
			bind:value={constantWord}
		>
			{#each words as word}
				<option value={word}>{word}</option>
			{/each}
		</select>

		<label class="ml-4">
			<input
				type="checkbox"
				bind:checked={varyFirstWord}
				class="cursor-pointer"
			/>
			<span class="ml-2">vary first word</span>
		</label>
	</div>

	<div class="mt-4 flex flex-wrap">
		{#each output as combo}
			<p class="border font-pona p-2 text-4xl sm:text-5xl group relative">
				{combo}

				<span
					class="absolute z-10 bottom-full font-sans text-base left-1/2 -translate-x-1/2 pointer-events-none
						opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:pointer-events-auto
						bg-black text-white px-2 py-1 rounded-lg"
				>
					{combo}
				</span>
			</p>
		{/each}
	</div>
</div>
