<template>
  <form-dialog
    v-model="drawer"
    :cancel-text="$t('common.action.close')"
    :loading="loading"
    :submit-text="$t('common.action.save')"
    :title="$t('user.model.changePassword')"
    width="400px"
    @close="cancel"
    @submit="handleSubmit"
  >
    <template slot="content">
      <app-form>
        <div class="pb-1 column">
          <app-password
            v-model="form.password"
            :hide-details="false"
            :label="$t('passwordReset.model.newPassword')"
            rules="required"
            @keyup.enter="handleSubmit"
          />
        </div>
        <div class="column">
          <app-password
            v-model="form.password_confirmation"
            :hide-details="false"
            :label="$t('passwordReset.model.newPasswordConfirmation')"
            rules="required|confirmed:password"
            @keyup.enter="handleSubmit"
          />
        </div>
      </app-form>
    </template>
  </form-dialog>
</template>

<script>
import { defineComponent, toRef, ref, watch, reactive, useContext, useRouter } from '@nuxtjs/composition-api'
import FormDialog from '@/components/common/organisms/FormDialog'
import AppPassword from '@/components/common/atoms/AppPassword'
import AppForm from '@/components/common/atoms/AppForm'

export default defineComponent({
  components: {
    FormDialog,
    AppForm,
    AppPassword
  },
  setup(_, { root }) {
    const initialState = () => ({
      form: {
        password: null,
        password_confirmation: null
      },
      id: null
    })

    const { $api, $toast } = useContext()
    const drawer = ref(false)
    const loading = ref(false)
    const router = useRouter()
    const state = reactive(initialState())

    watch(drawer, (val) => {
      if (!val) {
        Object.assign(state, initialState())
      }
    })

    const open = (id) => {
      drawer.value = true
      state.id = id
    }

    const handleSubmit = () => {
      loading.value = true
      $api.user
        .changePassword(state.id, state.form)
        .then(() => {
          $toast.success(root.$t('common.notice.success'))
          drawer.value = false
        })
        .finally(() => {
          loading.value = false
        })
    }

    const cancel = () => {
      router.push('/users')
    }

    return {
      drawer,
      loading,
      form: toRef(state, 'form'),
      open,
      handleSubmit,
      cancel
    }
  }
})
</script>
