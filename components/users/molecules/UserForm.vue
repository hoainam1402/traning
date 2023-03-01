<template>
  <v-row dense>
    <v-col cols="12">
      <app-text-field v-model="form.name" :label="$t('common.model.name')" rules="required|max:50" vid="name" />
    </v-col>
    <v-col cols="12">
      <app-text-field
        v-model="form.email"
        autocomplete="new-email"
        :label="$t('common.model.email')"
        rules="required|email|max:50"
        vid="email"
      />
    </v-col>
    <template v-if="!form.id">
      <v-col cols="12">
        <app-password
          v-model="form.password"
          autocomplete="new-password"
          :label="$t('common.model.password')"
          rules="required|min:6|max:60"
          vid="password"
        />
      </v-col>
      <v-col cols="12">
        <app-password
          v-model="form.password_confirmation"
          :label="$t('common.model.passwordConfirmation')"
          rules="required|confirmed:password|min:6|max:60"
        />
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppPassword from '@/components/common/atoms/AppPassword'

export default defineComponent({
  name: 'UserForm',
  components: {
    AppTextField,
    AppPassword
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const form = computed({
      get: () => props.value,
      set: (val) => {
        emit('input', val)
      }
    })

    return {
      form
    }
  }
})
</script>
