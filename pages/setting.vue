<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">
          <portal-target name="title" />
        </div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <portal-target name="action" />
    </div>
    <div class="d-flex flex-column flex-md-row">
      <page-tab class="mr-2" :items="items" />
      <nuxt />
    </div>
  </div>
</template>

<script>
import { reactive, toRef } from '@nuxtjs/composition-api'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import PageTab from '@/components/common/molecules/PageTab'

export default {
  name: 'SettingPage',
  components: {
    Breadcrumbs,
    PageTab
  },
  setup(_, { root }) {
    const state = reactive({
      items: [
        {
          title: root.$t('role.title'),
          icon: 'mdi-badge-account-horizontal-outline',
          route: 'setting-roles'
        }
      ]
    })

    return {
      items: toRef(state, 'items')
    }
  }
}
</script>
