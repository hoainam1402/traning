<template>
  <app-select
    v-model="innerValue"
    v-bind="$attrs"
    chips
    deletable-chips
    item-text="name"
    item-value="id"
    :items="items"
    multiple
    :search-input.sync="searchInput"
    small-chips
    @change="$emit('change')"
    @search-input="handleSearchInput"
  />
</template>

<script>
import { defineComponent, computed, ref, useContext, onMounted, watch } from '@nuxtjs/composition-api'
import { cloneDeep, debounce, isEmpty } from 'lodash'
import AppSelect from '@/components/common/atoms/AppSelect'

export default defineComponent({
  name: 'RoleSelect',
  components: {
    AppSelect
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    defaultParams: {
      type: Object,
      default: () => ({})
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
        const { data } = await $api.role.getRoles()
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
      handleSearchInput,
      searchInput
    }
  }
})
</script>
