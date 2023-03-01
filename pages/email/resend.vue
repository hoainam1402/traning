<template>
  <v-card class="pa-2">
    <h1>{{ $t('resend.title') }}</h1>
    <div class="mb-1 overline">{{ $t('resend.subTitle') }}</div>

    <v-card-text>
      <app-form v-slot="{ handleSubmit }">
        <v-row dense>
          <v-col cols="12">
            <app-text-field v-model="form.email" :label="$t('resend.model.email')" rules="required|email" vid="email" />
          </v-col>
        </v-row>

        <v-btn block color="primary" depressed :disabled="disabled" :loading="isLoading" @click="handleSubmit(resend)">
          {{ $t('resend.action.resend') }} {{ seconds }}
        </v-btn>
      </app-form>
    </v-card-text>
  </v-card>
</template>

<script>
import AppForm from '@/components/common/atoms/AppForm'
import AppTextField from '@/components/common/atoms/AppTextField'

const TIMEOUT = 3

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
      disabled: true,
      times: 0,
      resendInterval: null,
      secondsToEnable: TIMEOUT,
      seconds: '',
      form: {
        email: this.$route.query.email
      }
    }
  },
  mounted() {
    this.setTimer()
  },
  beforeDestroy() {
    clearInterval(this.resendInterval)
  },
  methods: {
    resend() {
      this.isLoading = true
      this.$axios
        .$post('/admin/auth/email/resend', this.form)
        .then(() => {
          this.$toast.success(this.$t('resend.message.success'))
        })
        .finally(() => {
          this.isLoading = false
          this.setTimer()
        })
    },
    setTimer() {
      this.disabled = true
      this.times++
      this.secondsToEnable = TIMEOUT * this.times

      this.resendInterval = setInterval(() => {
        if (this.secondsToEnable === 0) {
          clearInterval(this.resendInterval)
          this.seconds = ''
          this.disabled = false
        } else {
          this.seconds = `( ${this.secondsToEnable} )`
          this.secondsToEnable--
        }
      }, 1000)
    }
  }
}
</script>
