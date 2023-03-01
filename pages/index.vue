<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="display-1">{{ $t('dashboard.title') }}</div>
    <v-row class="py-1" dense>
      <v-col v-if="$acl.permission('dashboard.view')" cols="12">
        <net-profit-and-revenue-chart />
      </v-col>
      <v-col v-if="$acl.permission('dashboard.view')" cols="12" md="8">
        <revenue-chart />
      </v-col>
      <v-col cols="12" md="4">
        <birthday-of-customers />
      </v-col>
      <v-col cols="12" :md="$acl.permission('dashboard.view') ? 6 : 8">
        <product-chart />
      </v-col>
      <v-col v-if="$acl.permission('dashboard.view')" cols="12" md="6">
        <sales-and-orders />
      </v-col>
      <v-col cols="12" md="6">
        <recent-order-list />
      </v-col>
      <v-col cols="12" md="6">
        <out-of-product-list />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NetProfitAndRevenueChart from '@/components/dashboard/molecules/NetProfitAndRevenueChart'
import RevenueChart from '@/components/dashboard/molecules/RevenueChart'
import BirthdayOfCustomers from '@/components/dashboard/molecules/BirthdayOfCustomers'
import ProductChart from '@/components/dashboard/molecules/ProductChart'
import SalesAndOrders from '@/components/dashboard/molecules/SalesAndOrders'
import RecentOrderList from '@/components/dashboard/molecules/RecentOrderList'
import OutOfProductList from '@/components/dashboard/molecules/OutOfProductList'

export default {
  name: 'DashboardIndex',
  components: {
    NetProfitAndRevenueChart,
    RevenueChart,
    BirthdayOfCustomers,
    ProductChart,
    SalesAndOrders,
    RecentOrderList,
    OutOfProductList
  }
}
</script>
