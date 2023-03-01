<template>
  <v-card height="100%" :loading="loading">
    <v-card-title>{{ $t('dashboard.birthdayOfCustomers') }}</v-card-title>
    <v-card-text>
      <v-list two-line>
        <v-list-item-group active-class="primary--text">
          <v-virtual-scroll height="280" :item-height="64" :items="dashboard">
            <template #default="{ item, active }">
              <v-list-item :key="item.index">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" />
                  <v-list-item-subtitle class="text--primary" v-text="item.phone" />
                  <v-list-item-subtitle class="text--primary" v-text="item.dateOfBirth" />
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon v-if="!active" color="grey">mdi-gift</v-icon>
                  <v-icon v-else color="primary">mdi-gift-open</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, ref, onMounted } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BirthdayOfCustomers',
  setup() {
    const { $api, $auth } = useContext()
    const state = reactive({
      dashboard: []
    })
    const loading = ref(false)

    onMounted(() => {
      if ($auth.loggedIn) {
        loading.value = true
        $api.dashboard
          .getBirthdayOfCustomers()
          .then(({ data }) => {
            state.dashboard = data
          })
          .finally(() => {
            loading.value = false
          })
      }
    })

    return {
      loading,
      dashboard: toRef(state, 'dashboard')
    }
  }
})
</script>
