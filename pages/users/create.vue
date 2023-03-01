<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('user.action.create') }}</div>
        <breadcrumbs />
      </div>
    </div>
    <v-row dense>
      <v-col cols="6">
        <form-card
          :cancel-text="$t('common.action.cancel')"
          :loading="loading"
          :submit-text="$t('common.action.create')"
          :title="$t('user.action.create')"
          @cancel="back"
          @submit="submit"
        >
          <template slot="content">
            <user-form v-model="form" />
          </template>
        </form-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useRouter, watch } from '@nuxtjs/composition-api'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import FormCard from '@/components/common/molecules/FormCard'
import UserForm from '@/components/users/molecules/UserForm'

export default defineComponent({
  components: {
    Breadcrumbs,
    FormCard,
    UserForm
  },
  setup(_, { root }) {
    const initialState = () => ({
      form: {
        name: null,
        email: null,
        password: null,
        password_confirmation: null
      }
    })
    const { $api, $toast } = useContext()
    const router = useRouter()
    const state = reactive(initialState())
    const loading = ref(false)

    watch(_, (val) => {
      if (!val) {
        Object.assign(state, initialState())
      }
    })

    const submit = () => {
      loading.value = true
      $api.user
        .createUser(state.form)
        .then(() => {
          $toast.success(root.$t('common.notice.success'))
          back()
        })
        .finally(() => {
          loading.value = false
        })
    }
    const back = () => {
      router.push({ name: 'users' })
    }

    return {
      form: toRef(state, 'form'),
      loading,
      submit,
      back
    }
  }
})
</script>
