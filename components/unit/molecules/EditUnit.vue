<template>
  <v-edit-dialog large persistent @save="save">
    <div>{{ item.name }}</div>
    <template #input>
      <div class="mt-2 mb-2 text-h6">{{ $t('unit.action.updateUnit') }}</div>
      <app-text-field
        v-model="form.name"
        :errors="errors.name"
        :hide-details="false"
        :label="$t('unit.model.name')"
        maxlength="20"
        required
        rules="required|max:20"
      />
    </template>
  </v-edit-dialog>
</template>

<script>
import { defineComponent, reactive, toRef, useContext } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  name: 'EditUnit',
  components: {
    AppTextField
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { root, emit }) {
    const { $api, $toast } = useContext()

    const state = reactive({
      form: Object.assign({}, props.item)
    })

    const save = async () => {
      await $api.unit
        .updateUnit(state.form)
        .then(() => {
          $toast.success(root.$t('common.notice.success'))
        })
        .finally(() => {
          emit('refresh')
        })
    }

    return {
      form: toRef(state, 'form'),
      save
    }
  }
})
</script>
