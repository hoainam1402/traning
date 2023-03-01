<template>
  <v-form>
    <v-row dense>
      <v-col cols="12">
        <app-text-field v-model="form.name" :label="$t('role.model.name')" rules="required|max:50" />
      </v-col>
      <v-col cols="12">
        <app-textarea v-model="form.description" :label="$t('role.model.description')" rules="max:200" />
      </v-col>
    </v-row>
    <permission-list v-model="form.permissions" />
  </v-form>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import AppTextField from '@/components/common/atoms/AppTextField'
import AppTextarea from '@/components/common/atoms/AppTextarea'
import PermissionList from '@/components/setting/molecules/PermissionList'

export default defineComponent({
  name: 'RoleForm',
  components: {
    AppTextField,
    AppTextarea,
    PermissionList
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
