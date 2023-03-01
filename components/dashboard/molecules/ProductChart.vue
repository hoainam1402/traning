<template>
  <v-card height="100%" :loading="loading">
    <v-card-title>{{ $t('dashboard.product') }}</v-card-title>
    <v-card-text>
      <vue-apex-charts height="300" :options="chartOptions" :series="series" type="pie" />
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ProductChart',
  setup() {
    const { $api, $auth } = useContext()
    const state = reactive({
      series: [],
      chartOptions: {
        chart: {
          events: {
            mounted: (chart) => {
              chart.windowResizeHandler()
            }
          }
        },
        labels: [],
        dataLabels: {
          enabled: false
        }
      }
    })
    const loading = ref(false)

    onMounted(() => {
      if ($auth.loggedIn) {
        loading.value = true
        $api.dashboard
          .getProducts()
          .then(({ data }) => {
            state.series = data.map((e) => parseInt(e.stocks))
            data.forEach((el) => {
              state.chartOptions.labels.push(`${el.name} (${el.size})`)
            })
          })
          .finally(() => {
            loading.value = false
          })
      }
    })

    return {
      loading,
      series: toRef(state, 'series'),
      chartOptions: toRef(state, 'chartOptions')
    }
  }
})
</script>
