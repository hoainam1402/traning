<template>
  <v-row dense>
    <v-col v-if="listDate.length > 0 && !create && !edited" class="py-0" cols="12">
      <v-tabs v-model="tab" background-color="transparent" class="w-full">
        <v-tab v-for="(item, index) in listDate" :key="index" class="uppercase" @click="setDate(item.applyDate)">
          {{ item.applyDate }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col class="py-0" cols="12">
      <v-simple-table v-if="quotations.length > 0 && (dates.length > 0 || create)">
        <template #default>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header.value" class="text-left" :width="header.width">
                <v-tooltip color="primary" top>
                  <template #activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ header.text }}</span>
                  </template>
                  <span>{{ header.text }}</span>
                </v-tooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in quotations" :key="item.quotableId">
              <td>
                <v-menu v-if="!edited && !create" offset-y>
                  <template #activator="{ on, attrs }">
                    <v-btn v-bind="attrs" icon v-on="on">
                      <v-icon color="accent" small>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      dense
                      :href="`${$config.apiUrl}/admin/quotation/export/${item.id}?vat=1`"
                      target="_blank"
                    >
                      <v-list-item-title>
                        <v-icon color="success" small>mdi-file-pdf</v-icon>
                        <span class="ml-1">{{ $t('quotation.action.haveVAT') }}</span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      dense
                      :href="`${$config.apiUrl}/admin/quotation/export/${item.id}?vat=0`"
                      target="_blank"
                    >
                      <v-list-item-title>
                        <v-icon color="error" small>mdi-file-pdf</v-icon>
                        <span class="ml-1">{{ $t('quotation.action.noVAT') }}</span>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
              <td>{{ index + 1 }}</td>
              <td>
                <span v-if="item.quotable">
                  {{ item.quotable.name }}
                </span>
              </td>
              <td v-for="product in products" :key="product.id">
                <template v-if="findIndex(item.products, { productId: product.id }) !== -1">
                  <show-price v-if="!edited" :product-id="product.id" :products="item.products" />
                  <input-table v-if="edited" :product-id="product.id" :products="item.products" />
                </template>
                <template v-else>-</template>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent, computed, onMounted, reactive, toRef, watch } from '@nuxtjs/composition-api'
import { findIndex } from 'lodash'
import ShowPrice from '@/components/quotations/atoms/ShowPrice'
import InputTable from '@/components/quotations/atoms/InputTable'

export default defineComponent({
  name: 'CustomerQuotationTable',
  components: {
    ShowPrice,
    InputTable
  },
  props: {
    value: {
      type: String,
      default: () => ''
    },
    quotations: {
      type: Array,
      required: true
    },
    products: {
      type: Array,
      required: true
    },
    edited: {
      type: Boolean,
      default: false
    },
    create: {
      type: Boolean,
      default: false
    },
    dates: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { root, emit }) {
    const state = reactive({
      tab: null,
      headers: [
        { text: '', value: 'action', width: '40px' },
        { text: root.$t('common.model.id'), value: 'index', width: '40px' },
        { text: root.$t('common.model.name'), value: 'name', width: '150px' }
      ]
    })
    const products = computed(() => props.products)
    const addHeader = () => {
      products.value.forEach((item) => {
        state.headers.push({ text: `${item.name} (${item.size})`, value: item.id, width: '150px' })
      })
      if (products.value.length <= 2) {
        state.headers.push({ text: '', value: '', width: 'auto' })
      }
    }

    const date = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const listDate = computed(() => props.dates)
    const setDate = (item) => {
      date.value = item
    }

    const resetHeader = () => {
      state.headers = [
        { text: '', value: 'action', width: '40px' },
        { text: root.$t('common.model.id'), value: 'index', width: '40px' },
        { text: root.$t('common.model.name'), value: 'name', width: '150px' }
      ]
    }

    watch(
      () => props.quotations,
      () => {
        resetHeader()
        addHeader()
      },
      {
        deep: true
      }
    )

    watch(
      () => props.dates,
      () => {
        state.tab = null
      }
    )

    onMounted(() => {
      resetHeader()
      addHeader()
      state.tab = null
    })

    return {
      tab: toRef(state, 'tab'),
      headers: toRef(state, 'headers'),
      listDate,
      setDate
    }
  },
  methods: {
    findIndex
  }
})
</script>

<style lang="scss" scoped>
.theme--light.v-data-table > .v-data-table__wrapper > table > thead tr {
  th {
    min-width: 120px !important;
    max-width: 120px !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  th:first-child {
    min-width: 10px !important;
    padding: 0 !important;
  }
  th:nth-child(2) {
    min-width: 10px !important;
    padding: 0 !important;
  }
  th:nth-child(3) {
    min-width: 200px !important;
  }
}
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody tr {
  td {
    min-width: 120px !important;
  }
  td:first-child {
    min-width: 10px !important;
    padding: 0 !important;
  }
  td:nth-child(2) {
    min-width: 10px !important;
    padding: 0 !important;
  }
  td:nth-child(3) {
    min-width: 200px !important;
    max-width: 200px !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.theme--light.v-data-table > .v-data-table__wrapper > table {
  overflow: scroll;
}
</style>
