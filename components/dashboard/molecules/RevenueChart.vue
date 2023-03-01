<template>
  <div>
    <v-card height="100%" :loading="loading">
      <v-card-title>{{ $t('dashboard.revenue') }}</v-card-title>
      <v-card-text>
        <vue-apex-charts ref="chart" height="350" :options="chartOptions" :series="series" type="line" />
      </v-card-text>
    </v-card>
    <revenue-dialog ref="revenueDialog" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import RevenueDialog from '@/components/revenue/molecules/RevenueDialog'

export default defineComponent({
  name: 'RevenueChart',
  components: {
    RevenueDialog
  },
  data() {
    return {
      loading: false,
      series: [
        {
          name: 'Doanh thu',
          data: []
        }
      ],
      chartOptions: {
        chart: {
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          },
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler()
            },
            click: (_event, _chartContext, config) => {
              if (config.dataPointIndex !== -1) this.$refs.revenueDialog.open(config.dataPointIndex)
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          }
        },
        xaxis: {
          categories: this.$moment.monthsShort()
        },
        yaxis: {
          labels: {
            formatter: (val) => this.$options.filters.currency(val)
          }
        }
      }
    }
  },
  mounted() {
    this.loading = true
    this.$api.dashboard
      .getRevenues()
      .then(({ data }) => {
        this.$refs.chart.updateSeries([
          {
            name: 'Doanh thu',
            data: data.map((e) => parseInt(e))
          }
        ])
      })
      .finally(() => {
        this.loading = false
      })
  }
})
</script>
