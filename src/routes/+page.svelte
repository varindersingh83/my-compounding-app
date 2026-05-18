<script lang="ts">
	import Chart from '$lib/Chart.svelte';
	import { calculateCompoundInterest } from '$lib/compounding';
	import { focusTrap } from 'svelte-focus-trap';
	
	interface Contribution {
	  yearNumber: number;
	  total: number;
	  principalValue: number;
	}
  
	let initialDeposit: string = '';
	let annualContribution: string = '';
	let yearsOfGrowth: number | null = null;
	let rateOfReturn: number | null = null;
  
	let contributions: Contribution[] = [];
	let totalContributionAmount: number = 0;
	let totalAmount: number = 0;
	let isFocused: boolean = true;
	let activeTab: 'graph' | 'table' = 'graph';
  
	function calculate() {
	  const initialDepositNum = parseFloat(initialDeposit.replace(/[^0-9.-]+/g, '')) || 0;
	  const annualContributionNum = parseFloat(annualContribution.replace(/[^0-9.-]+/g, '')) || 0;
	  const yearsNum = yearsOfGrowth || 0;
	  const rateNum = rateOfReturn || 0;
	  
	  contributions = calculateCompoundInterest(
		initialDepositNum,
		annualContributionNum,
		yearsNum,
		rateNum
	  );
  
	  totalContributionAmount = initialDepositNum + annualContributionNum * yearsNum;
	  totalAmount = contributions.length ? contributions[contributions.length - 1].total : 0;
	}
  
	function formatCurrency(value: number): string {
	  return new Intl.NumberFormat('en-US', { 
		style: 'currency', 
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	  }).format(value);
	}
  
	function handleBlur(event: Event) {
	  const target = event.target as HTMLInputElement;
	  const value = parseFloat(target.value);
	  if (!isNaN(value)) {
		target.value = formatCurrency(value);
	  }
	}
  
	function handleFocus(event: Event) {
	  const target = event.target as HTMLInputElement;
	  target.value = target.value.replace(/[^0-9.-]+/g, '');
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let value = target.value.replace(/[^0-9.-]+/g, '');
		
		// If the value is empty, just return
		if (!value) {
			initialDeposit = '';
			return;
		}

		// Convert to number and format
		const numValue = parseFloat(value);
		if (!isNaN(numValue)) {
			const formattedValue = formatCurrency(numValue);
			target.value = formattedValue;
			initialDeposit = formattedValue;
		}
	}

	function handleAnnualInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let value = target.value.replace(/[^0-9.-]+/g, '');
		
		// If the value is empty, just return
		if (!value) {
			annualContribution = '';
			return;
		}

		// Convert to number and format
		const numValue = parseFloat(value);
		if (!isNaN(numValue)) {
			const formattedValue = formatCurrency(numValue);
			target.value = formattedValue;
			annualContribution = formattedValue;
		}
	}

	function handleYearsInput(event: Event) {
		const target = event.target as HTMLInputElement;
		let value = target.value.replace(/^0+/, ''); // Remove leading zeros
		if (value === '') value = '0'; // If empty, set to 0
		target.value = value;
		yearsOfGrowth = parseInt(value) || 0;
	}
</script>

<style>
	.container {
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  /* height: 100vh; */
	  text-align: center;
	  margin: auto;
	  padding: 0 20px;
	}
  
	.heading {
	  margin-bottom: 1rem;
	}
  
	.cards-container {
	  display: flex;
	  flex-direction: row; /* Side by side on larger screens */
	  justify-content: center;
	  align-items: flex-start;
	  gap: 1rem;
	  width: 100%;
	  max-width: 1200px;
	}
  
	.form-card {
	  flex: 1;
	  max-width: 400px; /* Limit the width of the left card */
	}
  
	.chart-card {
	  flex: 2; /* Allow the right card to take more space */
	  max-width: 800px; /* Ensure the chart card has a reasonable max-width */
	}
  
	.input {
	  width: 100%; /* Ensure inputs take the full width */
	}
  
	.label {
	  display: block;
	  margin-bottom: 1rem;
	}
  
	.card-footer {
	  display: flex;
	  justify-content: center;
	}
  
	button {
	  margin-top: 20px;
	}
  
	@media (max-width: 768px) {
	  .cards-container {
	    flex-direction: column; /* Stack vertically on smaller screens */
	  }
	}

	.tabs {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.tab {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 0.25rem;
		cursor: pointer;
		background: none;
	}

	.tab.active {
		background: #4a5568;
		color: white;
	}

	table {
		border-collapse: collapse;
		width: 100%;
	}

	th {
		background-color: #4a5568;
		color: white;
		text-align: left;
	}

	td, th {
		border: 1px solid #e2e8f0;
	}

	.table-scroll-container {
		max-height: 400px;
		overflow-y: auto;
	}
</style>
  
<div class="container">
	<h1 class="heading text-4xl font-bold">Compound It!</h1>
	<br>
	<br>
	<div class="cards-container">
	  <form  class="card form-card p-4" id="formInput">
		<label class="label">
		  <span>Initial deposit</span>
		  <input 
			class="input" 
			type="text" 
			bind:value={initialDeposit} 
			placeholder="$0.00" 
			on:input={handleInput}
			on:blur={handleBlur} 
			on:focus={handleFocus} 
		  />
		</label>
		<label class="label">
		  <span>Contribution amount</span>
		  <input 
			class="input" 
			type="text" 
			bind:value={annualContribution} 
			placeholder="$0.00" 
			on:input={handleAnnualInput}
			on:blur={handleBlur} 
			on:focus={handleFocus} 
		  />
		</label>
		<label class="label">
		  <span>Years of growth</span>
		  <input 
			class="input" 
			type="number" 
			bind:value={yearsOfGrowth} 
			placeholder="0" 
			on:input={handleYearsInput}
		  />
		</label>
		<label class="label">
		  <span>Estimated rate of return</span>
		  <input 
			class="input" 
			type="number" 
			step="0.01" 
			bind:value={rateOfReturn} 
			placeholder="0.0" 
		  />
		</label>
		<p>Rate of Return since inception 1986</p>
		<a href="https://docs.google.com/spreadsheets/d/1j9cpvyc6XutYj8Regu8sQeh_GqYqSb6G8MG2YqWs3cM/edit?usp=sharing">S&P 500: 9.97%   |   Nasdaq: 17.91%</a>
		<br>
		<footer class="card-footer">
		  <button type="button" class="btn variant-filled" on:click={calculate}>Calculate</button>
		</footer>
	  </form>
	  <div class="card chart-card p-4" id="formOutput">
		<h2 class="text-xl font-bold">Results</h2>
		<div class="flex justify-between">
		  <span>Contribution amount</span>
		  <span>{formatCurrency(totalContributionAmount)}</span>
		</div>
		<div class="flex justify-between">
		  <span>Total</span>
		  <span>{formatCurrency(totalAmount)}</span>
		</div>

		<div class="tabs mt-4">
			<button 
				class="tab {activeTab === 'graph' ? 'active' : ''}" 
				on:click={() => activeTab = 'graph'}
			>
				Graph
			</button>
			<button 
				class="tab {activeTab === 'table' ? 'active' : ''}" 
				on:click={() => activeTab = 'table'}
			>
				Table
			</button>
		</div>

		{#if activeTab === 'graph'}
			<Chart {contributions} />
		{:else}
			<div class="table-scroll-container overflow-x-auto">
				<table class="table-auto w-full mt-4">
					<thead>
						<tr>
							<th class="px-4 py-2">Year</th>
							<th class="px-4 py-2">Contribution So Far</th>
							<th class="px-4 py-2">Total So Far</th>
						</tr>
					</thead>
					<tbody>
						{#each contributions as contribution}
							<tr>
								<td class="border px-4 py-2">{contribution.yearNumber}</td>
								<td class="border px-4 py-2">{formatCurrency(contribution.principalValue)}</td>
								<td class="border px-4 py-2">{formatCurrency(contribution.total)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	  </div>
	</div>
</div>
