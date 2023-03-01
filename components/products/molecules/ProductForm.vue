<template>
  <app-form>
    <v-row dense>
      <v-col cols="8">
        <v-card class="pa-2">
          <v-row dense>
            <v-col cols="6">
              <app-text-field v-model="form.name" :label="$t('product.model.name')" rules="required|max:100" />
            </v-col>
            <v-col cols="6">
              <app-text-field v-model="form.size" :label="$t('product.model.size')" rules="required" />
            </v-col>
            <v-col cols="4">
              <app-text-field
                v-model="form.amount"
                :label="$t('product.title.amount')"
                rules="required|min_value:1"
                type="number"
              />
            </v-col>
            <v-col cols="4">
              <app-select
                v-model="form.type"
                :disabled="form.id !== null"
                :items="types"
                :label="$t('product.title.type')"
                rules="required"
              />
            </v-col>
            <v-col class="d-flex" cols="4">
              <unit-autocomplete
                v-model="form.unit.id"
                class="tw-w-full"
                :is-close-refresh.sync="isCloseRefresh"
                :is-refresh.sync="isRefresh"
                :label="$t('product.model.unit')"
                rules="required"
              />
              <v-btn
                class="ml-1 pa-0"
                color="grey"
                dense
                depressed
                height="40"
                min-width="40"
                outlined
                @click="addUnit"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-card class="pa-2 mt-2">
          <v-tabs v-model="tab" class="pb-2">
            <v-tab>{{ $t('product.tabs.description') }}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <editor v-model="form.description" :init="tinyMC" rules="max:255" />
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="pa-2">
          <v-img contain height="300" :src="form.imageUrl | productImageDefault" />
          <v-card-text class="px-0 pb-0">
            <app-file-input
              v-model="form.image"
              accept="image/jpg, image/jpeg, image/png"
              label="Image"
              :rules="form.imageUrl ? '' : 'required'"
              @change="onFileChange"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <add-unit ref="addUnit" @closeRefresh="closeRefresh" @refresh="refresh" />
  </app-form>
</template>

<script>
import { defineComponent, computed, reactive, ref, toRef } from '@nuxtjs/composition-api'
import Editor from '@tinymce/tinymce-vue'
import AppForm from '@/components/common/atoms/AppForm'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppSelect from '@/components/common/atoms/AppSelect'
import AppFileInput from '@/components/common/atoms/AppFileInput'
import UnitAutocomplete from '@/components/products/atoms/UnitAutocomplete'
import AddUnit from '@/components/unit/molecules/AddUnit'

export default defineComponent({
  name: 'ProductForm',
  components: {
    Editor,
    AppForm,
    AppTextField,
    AppSelect,
    AppFileInput,
    UnitAutocomplete,
    AddUnit
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { root, emit, refs }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    const state = reactive({
      types: [
        { value: root.$t('product.type.shelled'), key: 1 },
        { value: root.$t('product.type.noShell'), key: 0 }
      ],
      tab: null,
      image_url: null,
      tinyMC: {
        height: 300,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: [
          'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
        ],
        max_chars: 10
      }
    })

    const isRefresh = ref(null)
    const refresh = () => {
      isRefresh.value = true
    }

    const isCloseRefresh = ref(null)
    const closeRefresh = () => {
      isCloseRefresh.value = true
    }

    const addUnit = () => {
      refs.addUnit.open()
    }

    return {
      types: toRef(state, 'types'),
      tab: toRef(state, 'tab'),
      image_url: toRef(state, 'image_url'),
      tinyMC: toRef(state, 'tinyMC'),
      form,
      refresh,
      isRefresh,
      closeRefresh,
      isCloseRefresh,
      addUnit
    }
  },
  methods: {
    onFileChange(payload) {
      const file = payload // in case vuetify file input
      if (file) {
        this.form.imageUrl = URL.createObjectURL(this.form.image)
        URL.revokeObjectURL(file)
      } else {
        this.form.imageUrl = null
      }
    }
  }
})
</script>
