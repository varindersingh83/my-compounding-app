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
	let yearsOfGrowth: number = 0;
	let rateOfReturn: number = 0;
  
	let contributions: Contribution[] = [];
	let totalContributionAmount: number = 0;
	let totalAmount: number = 0;
	let isFocused: boolean = true;
  
	function calculate() {
	  const initialDepositNum = parseFloat(initialDeposit.replace(/[^0-9.-]+/g, '')) || 0;
	  const annualContributionNum = parseFloat(annualContribution.replace(/[^0-9.-]+/g, '')) || 0;
	  
	  contributions = calculateCompoundInterest(
		initialDepositNum,
		annualContributionNum,
		yearsOfGrowth,
		rateOfReturn
	  );
  
	  totalContributionAmount = initialDepositNum + annualContributionNum * yearsOfGrowth;
	  totalAmount = contributions.length ? contributions[contributions.length - 1].total : 0;
	}
  
	function formatCurrency(value: number): string {
	  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
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
</script>

<style>
	.container {
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  height: 100vh;
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
			placeholder="Years" 
		  />
		</label>
		<label class="label">
		  <span>Estimated rate of return</span>
		  <input 
			class="input" 
			type="number" 
			step="0.01" 
			bind:value={rateOfReturn} 
			placeholder="0.00%" 
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
		<Chart {contributions} />
	  </div>
	</div>
</div>
