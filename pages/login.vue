<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{ $t('login.title') }}</v-card-title>
      <v-card-subtitle>{{ $t('login.subTitle') }}</v-card-subtitle>

      <v-card-text>
        <app-form v-slot="{ handleSubmit }">
          <v-row dense>
            <v-col cols="12">
              <app-text-field
                v-model="form.email"
                :label="$t('login.model.email')"
                rules="required|email"
                vid="email"
                @keyup.enter="handleSubmit(submit)"
              />
              <v-subheader v-if="verifyError" v-html="verifyError" />
            </v-col>

            <v-col cols="12">
              <app-password
                v-model="form.password"
                :label="$t('login.model.password')"
                rules="required"
                @keyup.enter="handleSubmit(submit)"
              />
            </v-col>
          </v-row>

          <v-btn block color="primary" :disabled="isLoginDisabled" :loading="isLoading" @click="handleSubmit(submit)">
            {{ $t('login.action.login') }}
          </v-btn>

          <div class="mt-3">
            <nuxt-link :to="{ name: 'password-reset' }">
              {{ $t('login.action.forgot') }}
            </nuxt-link>
          </div>
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
  data() {
    return {
      isLoading: false,
      isLoginDisabled: false,
      verifyError: '',
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submit() {
      this.isLoading = true
      this.isLoginDisabled = true

      this.login(this.form)
    },
    login(data) {
      this.$auth
        .loginWith('local', { data })
        .then(() => {
          this.$router.push('/')
        })
        .catch((err) => {
          this.verifyError = err.response.data?.error?.link
        })
        .finally(() => {
          this.isLoading = false
          this.isLoginDisabled = false
        })
    }
  }
}
</script>
