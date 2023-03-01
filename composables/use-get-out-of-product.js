import { reactive, useContext } from '@nuxtjs/composition-api'
import useQueryFetch from '@/composables/use-query-fetch'
import configs from '@/configs'

export default function useGetOutOfProducts(payload = {}) {
  const { $api } = useContext()
  const { pagination } = configs
  const state = reactive({
    items: [],
    totalItem: 0
  })

  const fetch = useQueryFetch({
    fetcher: (p) => $api.dashboard.getOutOfProducts(p),
    conditions: {
      page: payload.page || 1,
      limit: payload.limit || pagination.itemsPerPage,
      q: payload.q || '',
      ...payload
    },
    afterFetch: ({ outOfProducts, pagination }) => {
      state.items = outOfProducts
      state.totalItem = pagination?.total

      return state
    }
  })

  return {
    state,
    ...fetch
  }
}
