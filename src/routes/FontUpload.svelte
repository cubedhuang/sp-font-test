<script lang="ts">
	let style: HTMLStyleElement | null = null;

	function handleFileUpload(e: Event) {
		const input = e.target as HTMLInputElement;

		const file = input.files?.[0];

		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onload = function (e) {
			if (!e.target || typeof e.target.result !== 'string') {
				return;
			}

			if (style) {
				style.remove();
			}

			style = document.createElement('style');
			style.textContent = `
				@font-face {
					font-family: 'UploadedFont';
					src: url('${e.target.result}');
				}
			`;

			document.head.appendChild(style);
		};

		reader.readAsDataURL(file);
	}
</script>

<p class="mt-4 flex">
	<label class="button py-1 px-4 cursor-pointer inline-block">
		<input
			type="file"
			accept=".otf,.ttf,.woff,.woff2"
			class="sr-only"
			on:change={handleFileUpload}
		/>

		Upload Custom Font
	</label>

	<button
		class="button py-1 px-4 ml-2"
		on:click={() => {
			if (style) {
				style.remove();
			}
		}}
	>
		Reset
	</button>
</p>
