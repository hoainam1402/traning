<template>
  <right-drawer v-model="drawer" :title="$t('supplier.action.detailSupplier')" width="600px" @close="cancel">
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab href="#1">
        {{ $t('supplier.title') }}
      </v-tab>
      <v-tab href="#2">
        {{ $t('product.title.productList') }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="1">
        <v-card flat>
          <v-card-text>
            <v-row dense>
              <label class="d-flex my-1 ml-1 tw-text-lg tw-w-full font-weight-bold black--text">
                {{ $t('supplier.generalInformation') }}
              </label>
              <v-col cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('supplier.model.name') }}:</label>
                <br />
                <span class="black--text font-weight-regular" v-text="form.name" />
              </v-col>
              <v-col cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('supplier.model.email') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="form.email" />
              </v-col>
              <v-col cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('supplier.model.phone') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="form.phone" />
              </v-col>
              <v-col cols="12">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('supplier.model.address') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="form.address" />
              </v-col>
              <v-col v-if="form.note" cols="12">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('supplier.model.note') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="form.note" />
              </v-col>
              <label class="d-flex mt-2 ml-1 tw-text-lg tw-w-full font-weight-bold black--text">
                {{ $t('supplier.contact') }}
              </label>
              <v-col cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('supplier.model.name') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="contact.name" />
              </v-col>
              <v-col cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('supplier.model.email') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="contact.email" />
              </v-col>
              <v-col cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('supplier.model.phone') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="contact.phone" />
              </v-col>
              <v-col cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('supplier.model.dateOfBirth') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="contact.dateOfBirth" />
              </v-col>
              <v-col cols="12">
                <label class="tw-text-black font-weight-bold mb-1 mr-2">{{ $t('supplier.model.location') }}:</label>
                <label class="black--text font-weight-regular">
                  <v-btn color="green" outlined>
                    <a :href="form.locationUrl" style="text-decoration: none" target="_blank">
                      {{ $t('supplier.action.openGoogleMap') }}
                      <v-icon color="green">mdi-map-marker</v-icon>
                    </a>
                  </v-btn>
                </label>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn outlined @click="cancel">{{ $t('common.action.cancel') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item value="2">
        <v-card flat>
          <v-card-text>
            <v-row dense>
              <label class="d-flex my-2 ml-1 tw-text-lg tw-w-full font-weight-bold black--text">
                {{ $t('supplier.productOfTheSupplier') }}
              </label>
              <product-of-suppliers :id="form.id" />
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn outlined @click="cancel">{{ $t('common.action.cancel') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </right-drawer>
</template>

<script>
import { defineComponent, reactive, ref, toRef } from '@nuxtjs/composition-api'
import RightDrawer from '@/components/common/atoms/AppRightDrawer'
import ProductOfSuppliers from '@/components/suppliers/molecules/ProductOfSuppliers'

export default defineComponent({
  name: 'DetailSupplierDrawer',
  components: {
    RightDrawer,
    ProductOfSuppliers
  },
  setup() {
    const drawer = ref(false)
    const loading = ref(false)
    const tab = ref(null)
    const initialState = () => ({
      form: {},
      contact: ''
    })
    const state = reactive(initialState())

    const open = (item) => {
      drawer.value = true
      state.form = Object.assign({}, item)
      state.contact = state.form.contact
    }

    const cancel = () => {
      drawer.value = false
    }

    return {
      drawer,
      loading,
      tab,
      form: toRef(state, 'form'),
      contact: toRef(state, 'contact'),
      open,
      cancel
    }
  }
})
</script>
