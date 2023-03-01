import { reactive, useContext } from '@nuxtjs/composition-api'
import useQueryFetch from '@/composables/use-query-fetch'
import configs from '@/configs'

export default function useGetProducts(payload = {}) {
  const { $api } = useContext()
  const { pagination } = configs
  const state = reactive({
    items: [],
    totalItem: 0
  })

  const fetch = useQueryFetch({
    fetcher: (p) => $api.product.getProducts(p),
    conditions: {
      page: payload.page || 1,
      limit: payload.limit || pagination.itemsPerPage,
      q: payload.q || '',
      ...payload
    },
    afterFetch: ({ data, pagination }) => {
      state.items = data
      state.totalItem = pagination?.total
    }
  })

  return {
    state,
    ...fetch
  }
}
