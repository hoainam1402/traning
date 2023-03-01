<template>
  <div class="tw-h-full pb-2">
    <v-card class="tw-w-full tw-h-1/2 mb-2">
      <v-card-title>
        {{ $t('dashboard.model.totalOrders') }}
      </v-card-title>
      <v-card-text class="mt-4">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h5 font-weight-bold">
              {{ items.totalOrders }}
            </v-list-item-title>
          </v-list-item-content>
          <v-icon color="primary" large>mdi-cart-outline</v-icon>
        </v-list-item>
      </v-card-text>
    </v-card>
    <v-card class="tw-w-full tw-h-1/2">
      <v-card-title>
        {{ $t('dashboard.model.totalOrdersPrice') }}
      </v-card-title>
      <v-card-text class="mt-4">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h5 font-weight-bold">
              {{ items.totalOrdersPrice | currency }}
            </v-list-item-title>
          </v-list-item-content>
          <v-icon color="primary" large>mdi-cash-multiple</v-icon>
        </v-list-item>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SalesAndOrders',
  setup() {
    const { $api } = useContext()
    const state = reactive({
      items: []
    })

    useFetch(() => {
      $api.dashboard.getSalesAndOrders().then(({ data }) => {
        state.items = data
      })
    })

    return {
      items: toRef(state, 'items')
    }
  }
})
</script>
