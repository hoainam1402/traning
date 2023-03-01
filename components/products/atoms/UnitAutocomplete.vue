<template>
  <app-autocomplete
    v-model="innerValue"
    v-bind="$attrs"
    :items="items"
    :menu-props="{ closeOnContentClick: true, maxHeight: '300' }"
    :multiple="multiple"
    :search-input.sync="searchInput"
    @search-input="handleSearchInput"
  />
</template>

<script>
import { computed, defineComponent, onMounted, ref, useContext, watch } from '@nuxtjs/composition-api'
import { cloneDeep, debounce, isEmpty } from 'lodash'
import AppAutocomplete from '@/components/common/atoms/AppAutocomplete'

export default defineComponent({
  name: 'UnitAutocomplete',
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
    isRefresh: {
      type: Boolean,
      default: false
    },
    isCloseRefresh: {
      type: Boolean,
      default: false
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
    const fetchData = async () => {
      try {
        const { data } = await $api.unit.getUnits()
        items.value = data
      } catch (e) {
        window.console.error(e)
      }
    }

    const searchInput = ref(null)
    const handleSearchInput = debounce(function (keyword) {
      fetchData(keyword)
    }, 250)

    onMounted(() => {
      if (!isEmpty(props.value)) {
        items.value = [cloneDeep(props.value)]
      }
      fetchData()
    })

    watch(
      () => props.isRefresh,
      (first) => {
        if (first === true) {
          fetchData()
          emit('update:isRefresh', false)
        }
      }
    )

    watch(
      () => props.isCloseRefresh,
      (first) => {
        if (first === true) {
          fetchData()
          emit('update:isCloseRefresh', false)
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
