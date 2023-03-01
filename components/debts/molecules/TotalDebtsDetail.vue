<template>
  <v-row class="px-2">
    <v-col class="pa-1" cols="6" md="3">
      <v-card class="mx-auto">
        <v-card-title class="subtitle-1 pb-0">
          {{ $t('debts.model.totalPriceDebts') }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title class="text-h6 font-weight-bold">
                {{ totalAllDebts.totalDebts | currency }}
              </v-list-item-title>
            </v-list-item-content>
            <v-icon class="mr-0" color="primary" left>mdi-currency-usd</v-icon>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col class="pa-1" cols="6" md="3">
      <v-card class="mx-auto">
        <v-card-title class="subtitle-1 pb-0">
          {{ $t('debts.model.totalPricePaid') }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title class="text-h6 font-weight-bold">
                {{ totalAllDebts.totalPaid | currency }}
              </v-list-item-title>
            </v-list-item-content>
            <v-icon class="mr-0" color="primary" left>mdi-currency-usd-off</v-icon>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col class="pa-1" cols="6" md="3">
      <v-card class="mx-auto">
        <v-card-title class="subtitle-1 pb-0">
          {{ $t('debts.model.currentDebtsBalance') }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title class="text-h6 font-weight-bold">
                {{ totalAllDebts.remainDebts | currency }}
              </v-list-item-title>
            </v-list-item-content>
            <v-icon class="mr-0" color="primary" left>mdi-cash-minus</v-icon>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col class="pa-1" cols="6" md="3">
      <v-card class="mx-auto">
        <v-card-title class="subtitle-1 pb-0">
          {{ $t('debts.model.totalShellDebts') }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list-item class="grow">
            <v-list-item-content>
              <v-list-item-title class="text-h6 font-weight-bold">
                {{ totalAllDebts.totalShellDebts }}
              </v-list-item-title>
            </v-list-item-content>
            <v-icon class="mr-0" color="primary" left>mdi-backup-restore</v-icon>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    totalAllDebts: {
      type: Object,
      default: () => {}
    }
  }
})
</script>
