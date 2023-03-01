<template>
  <v-row dense>
    <v-col v-if="listDate.length > 0 && !create && !edited" class="py-0" cols="12">
      <v-tabs v-model="tab" background-color="transparent" class="w-full">
        <v-tab v-for="(item, index) in listDate" :key="index" class="uppercase" @change="setDate(item.applyDate)">
          {{ item.applyDate }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col class="py-0" cols="12">
      <v-simple-table v-if="quotations.length > 0 && (dates.length > 0 || create)" class="w-full">
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
            <tr v-for="(item, index) in products" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>
                <span>{{ item.name }} ({{ item.size }})</span>
              </td>
              <td v-for="quotation in quotations" :key="quotation.quotableId">
                <template v-if="findIndex(quotation.products, { productId: item.id }) !== -1">
                  <show-price v-if="!edited" :product-id="item.id" :products="quotation.products" />
                  <input-table v-if="edited" :product-id="item.id" :products="quotation.products" />
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
  name: 'SupplierQuotationTable',
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
        { text: root.$t('common.model.id'), value: 'index', width: '40px' },
        { text: root.$t('product.title.productList'), value: 'name', width: '150px' }
      ]
    })
    const quotations = computed(() => props.quotations)
    const addHeader = () => {
      quotations.value.forEach((item) => {
        state.headers.push({ text: item.quotable.name, value: item.quotable.id, width: 'auto' })
      })
      if (quotations.value.length <= 2) {
        state.headers.push({ text: '', value: '', width: '50%' })
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
        { text: root.$t('common.model.id'), value: 'index', width: '40px' },
        { text: root.$t('product.title.productList'), value: 'name', width: '150px' }
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
  }

  th:first-child {
    min-width: 10px !important;
    width: 10px !important;
  }

  th:nth-child(2) {
    min-width: 200px !important;
  }
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody tr {
  td {
    min-width: 120px !important;
    width: 120px !important;
  }

  td:first-child {
    min-width: 10px !important;
    width: 10px !important;
  }

  td:nth-child(2) {
    min-width: 200px !important;
  }
}

.theme--light.v-data-table > .v-data-table__wrapper > table {
  overflow: scroll;
}
</style>
