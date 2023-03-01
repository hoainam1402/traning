<template>
  <right-drawer v-model="drawer" force-render :title="$t('role.action.create')" width="600px" @close="cancel">
    <app-form v-slot="{ handleSubmit }">
      <v-card flat>
        <v-card-text>
          <role-form v-model="form" />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="handleSubmit(submit)">
            {{ $t('common.action.create') }}
          </v-btn>
          <v-btn outlined @click="cancel">{{ $t('common.action.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </app-form>
  </right-drawer>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, watch } from '@nuxtjs/composition-api'
import RightDrawer from '@/components/common/organisms/RightDrawer'
import AppForm from '@/components/common/atoms/AppForm'
import RoleForm from '@/components/setting/molecules/RoleForm'

export default defineComponent({
  name: 'CreateRoleDrawer',
  components: {
    RightDrawer,
    AppForm,
    RoleForm
  },
  setup(_, { root, emit }) {
    const initialState = () => ({
      form: {
        name: null,
        description: null,
        permissions: []
      }
    })
    const { $api, $toast } = useContext()
    const drawer = ref(false)
    const state = reactive(initialState())

    watch(
      () => drawer,
      (val) => {
        if (!val) {
          Object.assign(state, initialState())
        }
      }
    )

    const open = () => {
      drawer.value = true
    }

    const submit = () => {
      $api.role.createRole(state.form).then(() => {
        emit('success')
        $toast.success(root.$t('role.notice.createSuccess'))
        drawer.value = false
      })
    }

    const cancel = () => {
      drawer.value = false
    }

    return {
      drawer,
      form: toRef(state, 'form'),
      open,
      submit,
      cancel
    }
  }
})
</script>
