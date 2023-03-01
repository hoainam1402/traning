<template>
  <v-card height="100%" :loading="loading">
    <v-card-title>{{ $t('dashboard.netProfitAndRevenue') }}</v-card-title>
    <v-card-text>
      <vue-apex-charts ref="chart" height="350" :options="plotOptions" :series="series" type="bar" />
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'NetProfitAndRevenueChart',
  data() {
    return {
      loading: false,
      series: [
        {
          name: 'Lợi nhuận ròng',
          data: []
        },
        {
          name: 'Doanh thu',
          data: []
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: this.$moment.monthsShort()
        },
        yaxis: {
          labels: {
            formatter: (val) => this.$options.filters.currency(val)
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: (val) => this.$options.filters.currency(val)
            }
          }
        }
      }
    }
  },
  mounted() {
    this.loading = true
    this.$api.dashboard
      .getProfitAndRevenue()
      .then(({ data }) => {
        this.$refs.chart.updateSeries([
          {
            name: 'Lợi nhuận ròng',
            data: data.profits.map((e) => parseInt(e))
          },
          {
            name: 'Doanh thu',
            data: data.revenues.map((e) => parseInt(e))
          }
        ])
      })
      .finally(() => {
        this.loading = false
      })
  }
})
</script>
