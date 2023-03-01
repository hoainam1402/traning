<template>
  <div class="my-2">
    <v-card>
      <v-card-title>{{ $t('changePassword.title.changePassword') }}</v-card-title>
      <v-card-text>
        <app-form v-slot="{ handleSubmit }">
          <v-row dense>
            <v-col cols="12" md="4">
              <app-password
                v-model="form.current_password"
                :label="$t('changePassword.model.currentPassword')"
                rules="required"
                vid="current_password"
              />
            </v-col>
            <v-col cols="12" md="4">
              <app-password
                v-model="form.new_password"
                :label="$t('changePassword.model.newPassword')"
                rules="required|min:6"
                vid="new_password"
              />
            </v-col>
            <v-col cols="12" md="4">
              <app-password
                v-model="form.new_password_confirmation"
                :label="$t('changePassword.model.newPasswordConfirmation')"
                rules="required|confirmed:new_password"
                vid="new_password_confirmation"
              />
            </v-col>
          </v-row>
          <div class="d-flex mt-2">
            <v-spacer />
            <v-btn color="primary" @click="handleSubmit(submit)">{{ $t('common.action.save') }}</v-btn>
          </div>
        </app-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { defineComponent, reactive, toRef, useContext, useRouter } from '@nuxtjs/composition-api'
import AppForm from '@/components/common/atoms/AppForm'
import AppPassword from '@/components/common/atoms/AppPassword'

export default defineComponent({
  name: 'SecurityTab',
  components: {
    AppForm,
    AppPassword
  },
  setup(_, { root }) {
    const { $api, $toast } = useContext()
    const router = useRouter()
    const state = reactive({
      form: {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }
    })

    const resetForm = () => {
      state.form = {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      }
    }

    const submit = () => {
      $api.profile.changePassword(state.form).then(() => {
        resetForm()
        $toast.success(root.$t('common.notice.success'))
        router.go(-1)
      })
    }

    return {
      form: toRef(state, 'form'),
      submit
    }
  }
})
</script>
