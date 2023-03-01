<template>
  <right-drawer v-model="drawer" :title="$t('customer.action.customerDetail')" width="600px" @close="cancel">
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab href="#1">
        {{ $t('customer.title') }}
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
              <v-col cols="12" sm="6">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('common.model.name') }}:</label>
                <br />
                <v-badge bordered color="info" :content="name">
                  <label class="black--text font-weight-regular" v-text="form.name" />
                </v-badge>
              </v-col>
              <v-col cols="12" sm="6">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('common.model.phone') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="form.phone" />
              </v-col>
              <v-col v-if="form.dateOfBirth" cols="12" sm="6">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('customer.model.dateOfBirth') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="form.dateOfBirth" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('customer.model.taxCode') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="form.taxCode" />
              </v-col>
              <v-col cols="12">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('customer.model.address') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="form.address" />
                <div v-for="item in form.addresses" :key="item.id">
                  <br />
                  <label :key="item.id" class="black--text font-weight-regular" v-text="item.address" />
                </div>
              </v-col>
              <v-col v-if="form.note" cols="12">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('customer.model.note') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="form.note" />
              </v-col>
              <v-divider />
              <label class="d-flex mt-2 ml-1 tw-text-lg tw-w-full font-weight-bold black--text">
                {{ $t('customer.contact') }}
              </label>
              <v-col cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('customer.model.name') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="contact.name" />
              </v-col>
              <v-col v-if="contact.email" cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('customer.model.email') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="contact.email" />
              </v-col>
              <v-col v-if="contact.dateOfBirth" cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('customer.model.dateOfBirth') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="contact.dateOfBirth" />
              </v-col>
              <v-col v-if="contact.phone" cols="12" sm="4">
                <label class="tw-text-black font-weight-bold mb-1">{{ $t('customer.model.phone') }}:</label>
                <br />
                <label class="black--text font-weight-regular" v-text="contact.phone" />
              </v-col>
              <v-col cols="12">
                <label class="tw-text-black font-weight-bold mb-1 mr-2">{{ $t('customer.model.location') }}:</label>
                <label class="black--text font-weight-regular">
                  <v-btn color="green" outlined>
                    <a :href="form.locationUrl" style="text-decoration: none" target="_blank">
                      {{ $t('customer.action.openGoogleMap') }}
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
              <label class="d-flex mt-2 ml-1 tw-text-lg tw-w-full font-weight-bold black--text">
                {{ $t('customer.products') }}
              </label>
              <product-of-customers :id="form.id" :drawer="drawer" />
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
import ProductOfCustomers from '@/components/customer/molecules/ProductOfCustomers'

export default defineComponent({
  components: {
    RightDrawer,
    ProductOfCustomers
  },
  setup() {
    const drawer = ref(false)
    const loading = ref(false)
    const tab = ref(null)
    const name = ref('')
    const initialState = () => ({
      form: {},
      contact: ''
    })
    const state = reactive(initialState())
    const open = (item) => {
      drawer.value = true
      state.form = Object.assign(state.form, item)
      name.value = item.customerType.name
      state.contact = state.form.contact
    }
    const cancel = () => {
      drawer.value = false
    }

    return {
      drawer,
      loading,
      tab,
      name,
      form: toRef(state, 'form'),
      contact: toRef(state, 'contact'),
      open,
      cancel
    }
  }
})
</script>
