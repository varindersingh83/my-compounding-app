<!-- src/lib/Chart.svelte -->
<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import { Chart, registerables } from 'chart.js';
    Chart.register(...registerables);
  
    interface Contribution {
      yearNumber: number;
      total: number;
      principalValue: number;
    }
  
    export let contributions: Contribution[] = [];
  
    let canvas: HTMLCanvasElement;
    let chart: Chart;
  
    onMount(() => {
      const ctx = canvas.getContext('2d')!;
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: contributions.map(contribution => `Year ${contribution.yearNumber}`),
          datasets: [
            {
              label: 'Total Balance',
              data: contributions.map(contribution => contribution.total),
              borderColor: 'green',
              fill: false,
            },
            {
              label: 'Principal Value',
              data: contributions.map(contribution => contribution.principalValue),
              borderColor: 'blue',
              fill: false,
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Total Balance Over Time'
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Year'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Amount'
              },
              ticks: {
                callback: function(value: string | number) {
                  if (typeof value === 'number') {
                    return '$' + value.toLocaleString();
                  }
                  return value;
                }
              }
            }
          }
        }
    });
    });
  
    afterUpdate(() => {
      if (chart) {
        chart.data.labels = contributions.map(contribution => `Year ${contribution.yearNumber}`);
        chart.data.datasets[0].data = contributions.map(contribution => contribution.total);
        chart.data.datasets[1].data = contributions.map(contribution => contribution.principalValue);
        chart.update();
      }
    });
  </script>
  
  <canvas bind:this={canvas}></canvas>
  