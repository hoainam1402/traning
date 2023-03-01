<template>
  <div class="tw-w-full">
    <div class="py-1">
      <div class="display-1">{{ $auth.user.name }}</div>
    </div>
    <div class="mb-4">
      <div>
        <span class="font-weight-bold">{{ $t('common.model.email') }}</span>
        <label-copy class="mx-1" :text="$auth.user.email" />
      </div>
      <div>
        <span class="font-weight-bold">{{ $t('common.model.id') }}</span>
        <span class="mx-1">{{ $auth.user.id }}</span>
      </div>
    </div>
    <v-tabs v-model="tab" background-color="transparent">
      <v-tab class="uppercase">{{ $t('profile.model.security') }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <security-tab />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import LabelCopy from '@/components/common/molecules/LabelCopy'
import SecurityTab from '@/components/profile/organisms/SecurityTab'

export default defineComponent({
  components: {
    LabelCopy,
    SecurityTab
  },
  setup() {
    const tab = ref('')

    return {
      tab
    }
  }
})
</script>
