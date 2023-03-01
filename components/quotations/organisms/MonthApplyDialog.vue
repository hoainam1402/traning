<template>
  <app-form v-slot="{ handleSubmit }">
    <form-dialog
      v-model="visible"
      :submit-text="$t('common.action.save')"
      :title="$t('quotation.dialog.title.monthApply')"
      width="400px"
      @submit="handleSubmit(submit)"
    >
      <template slot="content">
        <v-row dense>
          <v-col class="tw-mt-2" cols="12">
            <app-date-picker
              v-model="form.applyDate"
              :label="$t('quotation.dialog.label.dateApply')"
              rules="required"
              type="date"
            />
          </v-col>
          <v-col class="tw-mt-2" cols="12">
            <app-text-field v-model="form.amplitude" :label="$t('quotation.dialog.label.amplitude')" type="number" />
          </v-col>
        </v-row>
      </template>
    </form-dialog>
  </app-form>
</template>

<script>
import { defineComponent, computed, ref } from '@nuxtjs/composition-api'
import AppForm from '@/components/common/atoms/AppForm'
import FormDialog from '@/components/common/organisms/FormDialog'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import AppTextField from '@/components/common/atoms/AppTextField'

export default defineComponent({
  name: 'MonthApplyDialog',
  components: {
    AppForm,
    FormDialog,
    AppDatePicker,
    AppTextField
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const visible = ref(false)
    const open = () => {
      visible.value = true
    }
    const submit = () => {
      visible.value = false
      emit('click')
    }

    return {
      visible,
      form,
      open,
      submit
    }
  }
})
</script>
