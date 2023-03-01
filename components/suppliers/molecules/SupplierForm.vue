<template>
  <div>
    <v-row dense>
      <label class="d-flex my-1 ml-1 tw-text-lg tw-w-full font-weight-bold black--text">
        {{ $t('supplier.generalInformation') }}
      </label>
      <v-col cols="12" sm="6">
        <app-text-field v-model="form.name" :label="$t('supplier.model.name')" rules="required|max:100" vid="name" />
      </v-col>
      <v-col cols="12" sm="6">
        <app-text-field
          v-model="form.email"
          :label="$t('supplier.model.email')"
          rules="required|email|max:50"
          vid="email"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <app-phone v-model="form.phone" :label="$t('common.model.phone')" rules="required" vid="phone" />
      </v-col>
      <v-col cols="12" sm="6">
        <app-text-field v-model="form.address" :label="$t('supplier.model.address')" rules="max:200" vid="address" />
      </v-col>
      <v-col cols="12">
        <app-textarea v-model="form.note" :label="$t('supplier.model.note')" rows="3" rules="max:250" />
      </v-col>
      <v-col cols="12">
        <app-textarea v-model="form.locationUrl" :label="$t('supplier.model.location')" rows="3" rules="max:500" />
      </v-col>
      <label class="d-flex my-1 ml-1 tw-text-lg tw-w-full font-weight-bold black--text">
        {{ $t('supplier.contact') }}
      </label>
      <v-col cols="12" sm="6">
        <app-text-field
          v-model="form.contact.name"
          :label="$t('supplier.model.name')"
          rules="required|max:100"
          vid="contact.name"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <app-text-field
          v-model="form.contact.email"
          :label="$t('supplier.model.email')"
          rules="email|max:50"
          vid="contact.email"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <app-phone v-model="form.contact.phone" :label="$t('common.model.phone')" />
      </v-col>
      <v-col cols="12" sm="6">
        <app-date-picker
          v-model="form.contact.dateOfBirth"
          :label="$t('supplier.model.dateOfBirth')"
          :max-date="currentDate"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineComponent, computed, reactive, toRef } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppTextarea from '@/components/common/atoms/AppTextarea'
import AppPhone from '@/components/common/atoms/AppPhone'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'

export default defineComponent({
  name: 'SupplierForm',
  components: {
    AppTextField,
    AppTextarea,
    AppPhone,
    AppDatePicker
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const state = reactive({
      currentDate: new Date().toJSON()
    })

    return {
      form,
      currentDate: toRef(state, 'currentDate')
    }
  }
})
</script>
