<script lang="ts">
	import { rawWords } from '$lib/stores';
	import { onMount } from 'svelte';

	async function resetWords(includeParticles: boolean) {
		const particles = ['anu', 'e', 'en', 'la', 'li', 'pi'];

		const removedWords = [
			'kiki',
			'linluwi',
			'oke',
			'omekapo',
			'nimisin',
			'usawi',
			'wuwojiti',
			'yupekosi'
		];

		if (!includeParticles) {
			removedWords.push(...particles);
		}

		const addedWords = [
			'a1',
			'a2',
			'semea',
			'kala1',
			'ko1',
			'meli1',
			'mije1',
			'mu1',
			'mute1',
			'olin1',
			'pana1',
			'sewi1',
			'tenpo1',
			'uta1',
			'wile1',
			'namako1',
			'lanpan1',
			'niv<',
			'ni<',
			'ni^<',
			'ni^',
			'ni^>',
			'ni>',
			'niv>'
		];

		const data = (await fetch(
			'https://raw.githubusercontent.com/lipu-linku/jasima/main/data.json'
		).then(res => res.json())) as {
			data: Record<
				string,
				{
					word: string;
					usage_category: string;
					book: string;
					ucsur?: string;
				}
			>;
		};

		$rawWords = Object.values(data.data)
			.filter(
				word =>
					word.usage_category === 'core' ||
					word.usage_category === 'widespread' ||
					word.usage_category === 'common' ||
					word.usage_category === 'uncommon' ||
					word.book === 'ku suli'
			)
			.sort((a, b) => a.word.localeCompare(b.word))
			.filter(word => !removedWords.includes(word.word))
			.map(word => word.word)
			.concat(addedWords)
			.join('\n');
	}

	let before = '';
	let separator = '+';
	let after = '';

	$: words = $rawWords.split('\n');

	onMount(async () => {
		if ($rawWords === '') await resetWords(false);
	});

	let useCombos = true;
	let constantWordIndex = 0;
	let swapWordOrder = false;

	const fontFeatures = ['liga', 'ccmp', 'calt', 'ss01', 'ss02'];

	let features = fontFeatures.map(feature => {
		return {
			name: feature,
			enabled: !feature.startsWith('ss')
		};
	});

	$: featuresCss = features
		.map(feature => `"${feature.name}" ${feature.enabled ? '1' : '0'}`)
		.join(', ');

	$: output = useCombos
		? words.map(word => {
				if (swapWordOrder) {
					return `${before}${word}${separator}${words[constantWordIndex]}${after}`;
				} else {
					return `${before}${words[constantWordIndex]}${separator}${word}${after}`;
				}
			})
		: words.map(word => `${before}${word}${after}`);
</script>

<svelte:head>
	<title>nasin nanpa playground</title>
</svelte:head>

<div class="mt-20 max-w-screen-lg mx-auto px-8">
	<h1 class="font-bold text-4xl">nasin nanpa playground</h1>

	<p class="mt-2">
		<a
			href="https://github.com/cubedhuang/sp-font-test/tree/main"
			class="text-blue-500 hover:underline">GitHub</a
		>
	</p>

	<textarea class="mt-4 text-input h-32 w-full p-4" bind:value={$rawWords}
	></textarea>

	<button class="mt-2 button py-1 px-4" on:click={() => resetWords(true)}>
		Word List with Particles
	</button>
	<button class="mt-2 button py-1 px-4" on:click={() => resetWords(false)}>
		Word List without Particles
	</button>

	<div class="mt-4 flex items-baseline">
		<input
			type="text"
			bind:value={before}
			class="text-input px-2 py-1 w-12 text-center"
		/>

		{#if useCombos}
			<p class="mx-2">first</p>

			<input
				type="text"
				bind:value={separator}
				class="text-input px-2 py-1 w-12 text-center"
			/>

			<p class="mx-2">second</p>
		{:else}
			<p class="mx-2">word</p>
		{/if}

		<input
			type="text"
			bind:value={after}
			class="text-input px-2 py-1 w-12 text-center"
		/>
	</div>

	<div class="mt-2 flex flex-wrap gap-x-4 gap-y-2">
		<label class="text-input flex items-center px-4 py-1 cursor-pointer">
			<input
				type="checkbox"
				bind:checked={useCombos}
				class="cursor-pointer"
			/>
			<span class="ml-2">use combos</span>
		</label>

		<div class="flex">
			<button
				class="mr-1 button py-1 px-4"
				on:click={() => {
					constantWordIndex =
						(constantWordIndex - 1 + words.length) % words.length;
				}}
			>
				&larr;
			</button>

			<select
				class="text-input px-4 py-1 cursor-pointer"
				bind:value={constantWordIndex}
			>
				{#each words as word, i}
					<option value={i}>{word}</option>
				{/each}
			</select>

			<button
				class="ml-1 button py-1 px-4"
				on:click={() => {
					constantWordIndex = (constantWordIndex + 1) % words.length;
				}}
			>
				&rarr;
			</button>
		</div>

		<label class="text-input flex items-center px-4 py-1 cursor-pointer">
			<input
				type="checkbox"
				bind:checked={swapWordOrder}
				class="cursor-pointer"
			/>
			<span class="ml-2">swap word order</span>
		</label>
	</div>

	<div class="mt-2 flex gap-1 flex-wrap">
		{#each features as feature, i}
			<label
				class="text-input flex items-center px-4 py-1 cursor-pointer"
			>
				<input
					type="checkbox"
					bind:checked={feature.enabled}
					class="cursor-pointer"
				/>
				<span class="ml-2">{feature.name}</span>
			</label>
		{/each}
	</div>

	<div
		class="mt-4 flex flex-wrap font-pona text-4xl sm:text-5xl"
		style:font-feature-settings={featuresCss}
	>
		{#each output as combo}
			<p class="border p-2 group relative">
				{combo}

				<span
					class="absolute z-10 bottom-full font-sans text-base left-1/2 -translate-x-1/2 pointer-events-none
						opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:pointer-events-auto
						bg-black text-white px-2 py-1 rounded-lg w-max"
				>
					{combo}
				</span>
			</p>
		{/each}
	</div>
</div>
