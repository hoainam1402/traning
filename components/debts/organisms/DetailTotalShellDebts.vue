<template>
  <app-dialog v-if="dialog" v-model="dialog" width="600px" @close="cancel">
    <v-card flat>
      <v-card-title>
        <span class="text-h5">{{ $t('debts.model.listShell') }}</span>
      </v-card-title>
      <v-card-text class="pt-2">
        <product-of-debts :id="id" :dialog="dialog" :filter="filter" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn outlined @click="cancel">{{ $t('common.action.cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </app-dialog>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import AppDialog from '@/components/common/atoms/AppDialog'
import ProductOfDebts from '@/components/debts/molecules/ProductOfDebts'

export default defineComponent({
  name: 'DetailTotalShellDebts',
  components: {
    AppDialog,
    ProductOfDebts
  },
  props: {
    filter: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    const dialog = ref(false)
    const id = ref(null)

    const open = (item) => {
      dialog.value = true
      id.value = item.id
    }
    const cancel = () => {
      dialog.value = false
    }

    return {
      dialog,
      id,
      open,
      cancel
    }
  }
})
</script>
