import Vue from 'vue'
import { computed } from '@nuxtjs/composition-api'
import { createAcl, defineAclRules } from 'vue-simple-acl/dist/vue-simple-acl.vue2'

export default async function ({ $auth, $api }) {
  const { data } = await $api.permission.getPermissions()
  const user = computed(() => $auth.$state.user)

  const rules = () =>
    defineAclRules((setRule) => {
      data.forEach((permission) => {
        setRule(permission, (user) => user.value.scope.includes(permission))
      })
    })

  const simpleAcl = createAcl({
    user,
    rules
  })

  Vue.use(simpleAcl)
}
