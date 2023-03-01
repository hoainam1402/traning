<template>
  <app-form v-if="drawer" v-slot="{ handleSubmit }">
    <form-dialog
      v-model="drawer"
      :cancel-text="$t('common.action.cancel')"
      :loading="loading"
      :submit-text="$t('common.action.create')"
      :title="$t('unit.title')"
      width="600px"
      @close="close"
      @submit="handleSubmit(submit)"
    >
      <template slot="content">
        <list-unit :drawer="drawer" />
        <unit-form v-model="form" :errors="errors" />
      </template>
    </form-dialog>
  </app-form>
</template>

<script>
import { defineComponent, reactive, toRef, useContext } from '@nuxtjs/composition-api'
import ListUnit from '@/components/unit/molecules/ListUnit'
import UnitForm from '@/components/unit/molecules/UnitForm'
import AppForm from '@/components/common/atoms/AppForm'
import FormDialog from '@/components/common/organisms/FormDialog'

export default defineComponent({
  components: {
    ListUnit,
    UnitForm,
    AppForm,
    FormDialog
  },
  props: {
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  setup(_, { emit, root }) {
    const { $api, $toast } = useContext()

    const state = reactive({
      drawer: false,
      loading: false,
      form: {
        name: null
      }
    })

    const open = () => {
      state.drawer = true
    }

    const submit = async () => {
      if (state.loading) return
      state.loading = true
      await $api.unit
        .creatUnit({
          name: state.form.name
        })
        .then(() => {
          $toast.success(root.$t('common.notice.success'))
        })
      state.loading = false
      state.form.name = null
      cancel()
    }

    const close = () => {
      emit('closeRefresh')
    }

    const cancel = () => {
      emit('refresh')
      state.drawer = false
    }

    return {
      loading: toRef(state, 'loading'),
      drawer: toRef(state, 'drawer'),
      form: toRef(state, 'form'),
      open,
      close,
      submit,
      cancel
    }
  }
})
</script>
