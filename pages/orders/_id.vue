<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('order.action.viewOrder') }}</div>
        <breadcrumbs />
      </div>
    </div>
    <v-card flat>
      <v-card-text class="pb-0">
        <v-row dense>
          <v-col class="px-2" cols="12">
            <h2 class="black--text">{{ $t('order.model.customerInformation') }}</h2>
            <h3 class="py-2">{{ $t('common.model.name') }}: {{ customer.name }}</h3>
            <h3 class="pb-2">{{ $t('common.model.phone') }}: {{ customer.phone }}</h3>
            <h3 class="pb-2">{{ $t('order.model.deliveryAddress') }}: {{ order.deliveryAddress }}</h3>
            <v-divider />
          </v-col>
          <v-col class="px-2 mt-2" cols="12">
            <h2 class="black--text">{{ $t('order.model.productList') }}</h2>
            <app-data-table
              class="ml-5 py-2 flex-grow-1"
              :headers="headers"
              hide-default-footer
              :items="order.orderItems"
            >
              <template #item.index="{ index }">
                <div>{{ index + 1 }}</div>
              </template>
              <template #item.product="{ item }">
                <div>{{ item.product.name }} ({{ item.product.size }})</div>
              </template>
              <template #item.supplier="{ item }">
                <div>{{ item.supplier.name }}</div>
              </template>
              <template #item.amount="{ item }">
                <div>{{ item.amount }}</div>
              </template>
              <template #item.shellQuantity="{ item }">
                <div v-if="item.product.type === 1">{{ item.shellQuantity }} {{ $t('order.unit.shell') }}</div>
                <div v-else>-</div>
              </template>
              <template #item.residualGas="{ item }">
                <div v-if="item.product.type === 1">{{ item.residualGas }} {{ $t('order.unit.kg') }}</div>
                <div v-else>-</div>
              </template>
            </app-data-table>
            <v-divider />
          </v-col>
          <v-col class="px-2" cols="12" md="4">
            <div class="d-flex pb-2">
              <h3 class="mr-5">{{ $t('order.model.createdAt') }}: {{ order.createdAt | formatDate }}</h3>
              <h3>{{ $t('order.model.deliveryDate') }}: {{ order.deliveryDate | formatDate }}</h3>
            </div>
            <h3 class="pb-2">{{ $t('order.model.status') }}: {{ order.status | orderStatus }}</h3>
            <h3 class="pb-2">{{ $t('order.model.note') }}: {{ order.note }}</h3>
          </v-col>
          <v-col class="px-2 d-flex justify-end" cols="12" md="8">
            <h2 class="black--text mr-5">
              {{ $t('order.model.totalShell') }}: {{ order.totalShell }} {{ $t('order.unit.shell') }}
            </h2>
            <h2 class="black--text mr-5">
              {{ $t('order.model.totalResidualGas') }}: {{ order.totalResidualGas }} {{ $t('order.unit.kg') }}
            </h2>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end pb-2 pt-0">
        <v-btn class="white--text" color="primary" @click="goDebts">{{ $t('common.action.back') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useFetch, useRouter } from '@nuxtjs/composition-api'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import AppDataTable from '@/components/common/atoms/AppDataTable'

export default defineComponent({
  components: {
    Breadcrumbs,
    AppDataTable
  },
  setup(_, { root }) {
    const router = useRouter()
    const { $api, params } = useContext()
    const state = reactive({
      order: {},
      customer: {},
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false },
        { text: root.$t('orderItem.model.productName'), value: 'product', sortable: false },
        { text: root.$t('supplier.title'), value: 'supplier', sortable: false },
        { text: root.$t('orderItem.model.amount'), value: 'amount', sortable: false },
        { text: root.$t('orderItem.model.shell'), value: 'shellQuantity', sortable: false },
        { text: root.$t('orderItem.model.residualGas'), value: 'residualGas', sortable: false }
      ]
    })

    useFetch(async () => {
      try {
        const { data } = await $api.order.getOrder(params.value.id)
        state.order = data
        state.customer = data.customer
      } catch (e) {
        router.push('/orders')
      }
    })

    const goDebts = () => {
      router.go(-1)
    }

    return {
      order: toRef(state, 'order'),
      customer: toRef(state, 'customer'),
      headers: toRef(state, 'headers'),
      goDebts
    }
  }
})
</script>
