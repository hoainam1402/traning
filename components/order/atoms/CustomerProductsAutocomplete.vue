<template>
  <app-autocomplete
    v-model="innerValue"
    v-bind="$attrs"
    class="tw-w-full"
    :items="items"
    :menu-props="{ closeOnContentClick: true, maxHeight: '300' }"
    :multiple="multiple"
    :search-input.sync="searchInput"
    @change="$emit('change')"
    @search-input="handleSearchInput"
  >
    <template slot="selection" slot-scope="data">
      <span class="tw-font-medium">{{ data.item.name }} ({{ data.item.size }})</span>
    </template>
    <template slot="item" slot-scope="data">
      <span class="tw-font-medium">{{ data.item.name }} ({{ data.item.size }})</span>
    </template>
  </app-autocomplete>
</template>

<script>
import { cloneDeep, debounce, isEmpty } from 'lodash'
import { computed, defineComponent, ref, useContext, watch } from '@nuxtjs/composition-api'
import AppAutocomplete from '@/components/common/atoms/AppAutocomplete'

export default defineComponent({
  name: 'ProductsAutocomplete',
  components: {
    AppAutocomplete
  },
  props: {
    value: {
      type: [String, Number, Array, Object],
      default: null
    },
    defaultParams: {
      type: Object,
      default: () => ({})
    },
    multiple: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    }
  },
  setup(props, { emit }) {
    const { $api } = useContext()

    const innerValue = computed({
      get: () => props.value,
      set: (val) => {
        return emit('input', val)
      }
    })

    const items = ref([])
    const fetchData = async (keyword = '') => {
      try {
        const { data } = await $api.common.searchCustomerProducts(props.id, {
          s: keyword,
          ...props.defaultParams
        })
        items.value = data
      } catch (e) {
        window.console.error(e)
      }
    }

    const searchInput = ref(null)
    const handleSearchInput = debounce(function (keyword) {
      fetchData(keyword)
    }, 250)

    watch(
      () => props.id,
      () => {
        if (props.id) {
          if (!isEmpty(props.value)) {
            items.value = [cloneDeep(props.value)]
          }
          fetchData()
        }
      }
    )

    return {
      innerValue,
      items,
      searchInput,
      handleSearchInput
    }
  }
})
</script>
