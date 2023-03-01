<template>
  <div>
    <div class="font-weight-bold black--text my-1">{{ $t('role.model.permissions') }}</div>
    <v-simple-table>
      <thead>
        <tr>
          <th class="text-left">{{ $t('role.model.module') }}</th>
          <th class="text-left">{{ $t('role.model.action') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in permissions" :key="item.id">
          <td>{{ item.module }}</td>
          <td class="d-inline-flex justify-center align-center pa-0">
            <div v-for="action in item.permissions" :key="action.id" class="pa-0">
              <v-checkbox
                v-model="allows"
                class="mr-2 pt-1"
                dense
                hide-details
                :label="action.description"
                :value="action.id"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PermissionList',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const { $api } = useContext()
    const state = reactive({
      permissions: []
    })

    useFetch(() => {
      $api.permission.getModulePermissions().then(({ data }) => {
        state.permissions = data
      })
    })

    return {
      permissions: toRef(state, 'permissions')
    }
  },
  computed: {
    allows: {
      get() {
        return this.value
      },
      set(val) {
        return this.$emit('input', val)
      }
    }
  }
})
</script>
