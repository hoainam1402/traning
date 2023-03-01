<template>
  <v-switch
    v-model="status"
    class="tw-w-16"
    :disabled="loading"
    :false-value="0"
    :label="status | productStatus"
    :loading="loading"
    :true-value="1"
    @change="handleUpdateStatus"
  />
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ProductStatus',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const { $toast, $api } = useContext()
    const loading = ref(false)
    const state = reactive({
      status: props.item.status
    })

    const handleUpdateStatus = () => {
      loading.value = true
      $api.product
        .updateStatus(props.item.id, { status: state.status })
        .then(() => {
          $toast.success(root.$t('common.notice.success'))
          emit('refresh')
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      loading,
      status: toRef(state, 'status'),
      handleUpdateStatus
    }
  }
})
</script>
