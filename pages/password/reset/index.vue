<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{ $t('passwordForgot.title') }}</v-card-title>
      <v-card-subtitle>{{ $t('passwordForgot.subTitle') }}</v-card-subtitle>

      <v-card-text>
        <app-form v-slot="{ handleSubmit }">
          <v-row dense>
            <v-col cols="12">
              <app-text-field
                v-model="form.email"
                :label="$t('passwordForgot.model.email')"
                rules="required|email"
                vid="email"
              />
            </v-col>
          </v-row>

          <v-btn block color="primary" :loading="isLoading" @click="handleSubmit(submit)">
            {{ $t('passwordForgot.action.request') }}
          </v-btn>
        </app-form>
      </v-card-text>
    </v-card>

    <div class="text-center mt-6">
      <nuxt-link :to="{ name: 'login' }">
        {{ $t('passwordForgot.action.backToLogin') }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import AppForm from '@/components/common/atoms/AppForm'
import AppTextField from '@/components/common/atoms/AppTextField'

export default {
  components: {
    AppForm,
    AppTextField
  },
  layout: 'auth',
  auth: 'guest',
  data() {
    return {
      isLoading: false,
      form: {
        email: ''
      }
    }
  },
  methods: {
    submit() {
      this.isLoading = true

      this.forgot(this.form)
    },
    forgot(data) {
      this.$axios
        .$post('/admin/auth/password/email', data)
        .then(() => {
          this.$toast.success(this.$t('passwordForgot.message.success'))
          this.$router.push('/')
        })
        .catch(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
