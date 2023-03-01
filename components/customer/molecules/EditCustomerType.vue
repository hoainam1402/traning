<template>
  <v-edit-dialog large persistent @save="save">
    <v-chip class="text-decoration-underline">
      {{ item.name }}
    </v-chip>
    <template #input>
      <div class="mt-2 mb-2 text-h6">{{ $t('customerType.action.updateCustomerType') }}</div>
      <app-text-field
        v-model="form.name"
        :hide-details="false"
        :label="$t('customerType.model.name')"
        maxlength="20"
        required
        rules="required|max:20"
      />
    </template>
  </v-edit-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  name: 'EditCustomerType',
  components: { AppTextField },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props, { root, emit }) {
    const { $api, $toast } = useContext()

    const state = reactive({
      form: Object.assign({}, props.item)
    })
    const id = ref(props.item.id)

    const save = async () => {
      await $api.customerType.updateCustomerType(props.item.id, state.form).then(() => {
        emit('refresh')
        $toast.success(root.$t('common.notice.success'))
      })
    }

    return {
      id,
      form: toRef(state, 'form'),
      save
    }
  }
})
</script>
