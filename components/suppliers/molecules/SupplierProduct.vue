<template>
  <div>
    <v-row class="ma-1" dense>
      <v-col class="pl-0" cols="12" sm="6">
        <app-text-field v-model="searchInput" append-icon="mdi-magnify" :placeholder="$t('common.filter.search')" />
      </v-col>
      <v-col class="pl-1" cols="12" sm="2">
        <v-btn outlined @click="searchProduct(searchInput)">{{ $t('common.filter.search') }}</v-btn>
      </v-col>
      <v-col class="pl-2" cols="12" sm="2">
        <v-btn outlined @click="resetSearch">{{ $t('common.action.reset') }}</v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <template v-if="loading">
        <v-col v-for="n in 3" :key="`skeleton-${n}`" cols="12" md="4">
          <v-skeleton-loader class="mx-auto" type="card" />
        </v-col>
      </template>
      <v-col v-for="item in products" :key="item.id" cols="12" md="4">
        <v-card class="mx-auto" height="210">
          <v-img contain height="160" :src="item.imageUrl | productImageDefault" />
          <v-checkbox v-model="form.productIds" class="px-2 mt-1" :value="item.id">
            <template #label>
              <div>{{ item.name }} ({{ item.size }} )</div>
            </template>
          </v-checkbox>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineComponent, computed, useContext, ref, onMounted } from '@nuxtjs/composition-api'
import { cloneDeep, isEmpty } from 'lodash'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  components: {
    AppTextField
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const { $api } = useContext()
    const loading = ref(false)

    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const products = ref([])
    const fetchData = async (keyword = '') => {
      try {
        const { data } = await $api.product.getProducts({
          q: keyword,
          status: 1
        })
        products.value = data
      } catch (e) {
        window.console.error(e)
      }
    }

    const searchInput = ref('')
    onMounted(() => {
      if (!isEmpty(props.value)) {
        products.value = [cloneDeep(props.value)]
      }
      fetchData()
    })

    const searchProduct = (search) => {
      fetchData(search)
    }

    const resetSearch = () => {
      searchInput.value = ''
      searchProduct(null)
    }

    return {
      loading,
      form,
      products,
      searchInput,
      searchProduct,
      resetSearch
    }
  }
})
</script>
