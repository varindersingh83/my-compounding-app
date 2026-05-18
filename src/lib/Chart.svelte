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
              borderColor: 'white',
              fill: false,
              pointStyle: 'line',
            },
            {
              label: 'Principal Value',
              data: contributions.map(contribution => contribution.principalValue),
              borderColor: 'red',
              fill: false,
              pointStyle: 'line',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Total Balance Over Time'
            },
            legend: {
              labels: {
                usePointStyle: true,
                boxWidth: 20,
                boxHeight: 20,
              }
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
  
  <div class="chart-container">
    <canvas bind:this={canvas}></canvas>
  </div>
  
  <style>
.chart-container {
  width: 100%;
  /* min-height: 300px; */
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  width: 100% !important;
  max-width: 100%;
  height: 300px !important;
  min-height: 200px;
  display: block;
  margin: 0 auto 1rem auto;
}

@media (max-width: 600px) {
  .chart-container {
    /* min-height: 350px; */
    /* aspect-ratio: 1 / 1; */
    max-width: 100vw;
  }
  canvas {
    height: 350px !important;
    min-height: 350px;
  }
}
</style>
  