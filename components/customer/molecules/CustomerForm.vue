<template>
  <div>
    <v-row dense>
      <label class="d-flex my-1 ml-1 tw-text-lg tw-w-full font-weight-bold black--text">
        {{ $t('customer.generalInformation') }}
      </label>
      <v-col cols="12">
        <app-text-field v-model="form.name" :label="$t('common.model.name')" rules="required|max:50" vid="name" />
      </v-col>
      <v-col class="d-flex" cols="12" sm="6">
        <customer-type-autocomplete
          ref="customerType"
          v-model="form.customerTypeId"
          :label="$t('customer.model.type')"
          rules="required"
        />
        <v-btn
          class="ml-2 pa-0"
          color="grey"
          dense
          depressed
          height="40"
          min-width="40"
          outlined
          @click="addCustomerType"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <app-text-field
          v-model="form.taxCode"
          :label="$t('customer.model.taxCode')"
          rules="required|max:10|numeric"
          type="number"
          vid="tax_code"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <app-phone v-model="form.phone" :label="$t('common.model.phone')" rules="required" vid="phone" />
      </v-col>
      <v-col cols="12" sm="6">
        <app-date-picker
          v-model="form.dateOfBirth"
          :label="$t('customer.model.dateOfBirth')"
          :max-date="currentDate"
          vid="date_of_birth"
        />
      </v-col>
      <v-col class="d-flex" cols="12">
        <app-text-field
          v-model="form.address"
          class="tw-w-full"
          :label="$t('customer.model.address')"
          rules="required|max:200"
          vid="address"
        />
        <v-btn class="ml-2 pa-0" color="grey" dense depressed height="40" min-width="40" outlined @click="addAddress">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col class="py-0" cols="12" sm="12">
        <v-row v-for="(address, index) in form.addresses" :key="index" class="pl-2" dense>
          <v-col class="d-flex" cols="12">
            <app-text-field
              v-model="address.address"
              class="tw-w-full"
              :label="`${$t('customer.model.address')} ${index + 1}`"
              rules="required|max:200"
            />
            <v-btn class="ml-1 pa-0" color="error" icon @click="removeAddress(index)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <app-textarea v-model="form.note" :label="$t('customer.model.note')" rows="3" rules="max:250" />
      </v-col>
      <v-col cols="12">
        <app-textarea v-model="form.locationUrl" :label="$t('customer.model.location')" rows="3" rules="max:500" />
      </v-col>
      <label class="d-flex my-1 ml-1 tw-text-lg tw-w-full font-weight-bold black--text">
        {{ $t('customer.contact') }}
      </label>
      <v-col cols="12" sm="6">
        <app-text-field
          v-model="form.contact.name"
          :label="$t('customer.model.name')"
          rules="required|max:100"
          vid="contact.name"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <app-text-field
          v-model="form.contact.email"
          :label="$t('customer.model.email')"
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
          :label="$t('customer.model.dateOfBirth')"
          :max-date="currentDate"
        />
      </v-col>
    </v-row>
    <add-customer-type ref="addCustomerType" @refresh="fetchCustomerType" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, computed } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppTextarea from '@/components/common/atoms/AppTextarea'
import AppDatePicker from '@/components/common/atoms/AppDatePicker'
import AppPhone from '@/components/common/atoms/AppPhone'
import CustomerTypeAutocomplete from '@/components/customer/molecules/CustomerTypeAutocomplete'
import AddCustomerType from '@/components/customer/molecules/AddCustomerType'

export default defineComponent({
  components: {
    AppTextField,
    AppTextarea,
    AppDatePicker,
    AppPhone,
    CustomerTypeAutocomplete,
    AddCustomerType
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit, refs }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })
    const state = reactive({
      currentDate: new Date().toJSON()
    })

    const addCustomerType = () => {
      refs.addCustomerType.open()
    }
    const fetchCustomerType = () => {
      refs.customerType.fetchData()
    }

    const addAddress = () => {
      form.value.addresses.push({ address: '' })
    }
    const removeAddress = (i) => {
      form.value.addresses.splice(i, 1)
    }

    return {
      form,
      currentDate: toRef(state, 'currentDate'),
      addCustomerType,
      fetchCustomerType,
      addAddress,
      removeAddress
    }
  }
})
</script>
