<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('user.action.update') }}</div>
        <breadcrumbs />
      </div>
    </div>
    <v-row dense>
      <v-col cols="6">
        <form-card
          :cancel-text="$t('common.action.cancel')"
          is-update
          :loading="loading"
          :submit-text="$t('common.action.save')"
          :title="$t('user.action.update')"
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
import { defineComponent, ref, useContext, useFetch, useRoute, useRouter } from '@nuxtjs/composition-api'
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
    const { $api, $toast } = useContext()
    const route = useRoute()
    const router = useRouter()
    const id = route.value.params.id
    const form = ref({})
    const loading = ref(false)

    useFetch(async () => {
      const { data } = await $api.user.getUser(id)
      form.value = data
    })

    const submit = () => {
      loading.value = true
      $api.user
        .updateUser(id, form.value)
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
      form,
      loading,
      submit,
      back
    }
  }
})
</script>
