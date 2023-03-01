<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{ $t('passwordReset.title') }}</v-card-title>
      <v-card-subtitle>{{ $t('passwordReset.subTitle') }}</v-card-subtitle>

      <v-card-text>
        <app-form v-slot="{ handleSubmit }">
          <v-row dense>
            <v-col cols="12">
              <app-text-field v-model="form.email" disabled :label="$t('passwordReset.model.email')" vid="email" />
            </v-col>

            <v-col cols="12">
              <app-password
                v-model="form.password"
                :label="$t('passwordReset.model.newPassword')"
                rules="required|min:8"
                vid="password"
              />
            </v-col>

            <v-col cols="12">
              <app-password
                v-model="form.password_confirmation"
                :label="$t('passwordReset.model.newPasswordConfirmation')"
                rules="required|confirmed:password"
              />
            </v-col>
          </v-row>

          <v-btn block color="primary" :loading="isLoading" @click="handleSubmit(submit)">
            {{ $t('passwordReset.action.set') }}
          </v-btn>
        </app-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import AppForm from '@/components/common/atoms/AppForm'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppPassword from '@/components/common/atoms/AppPassword'

export default {
  components: {
    AppForm,
    AppTextField,
    AppPassword
  },
  layout: 'auth',
  auth: 'guest',
  data() {
    return {
      isLoading: false,
      form: {
        token: this.$route.params.token,
        email: this.$route.query.email,
        password: '',
        password_confirmation: ''
      }
    }
  },
  methods: {
    submit() {
      this.isLoading = true

      this.reset(this.form)
    },
    reset(data) {
      this.$axios
        .$post('/admin/auth/password/reset', data)
        .then(() => {
          this.$toast.success(this.$t('passwordReset.message.success'))
          this.$router.push('/')
        })
        .catch(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
