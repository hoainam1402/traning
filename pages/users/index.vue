<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div>
        <div class="display-1">{{ $t('user.title') }}</div>
        <breadcrumbs />
      </div>
      <v-spacer />
      <v-btn v-if="$acl.permission('users.create')" color="primary" :to="{ name: 'users-create' }">
        {{ $t('user.action.create') }}
      </v-btn>
    </div>
    <v-card>
      <list-filter v-model="conditions" @reset="resetFilter" />
      <v-divider class="my-1" />
      <app-data-table
        v-model="selectedItems"
        class="flex-grow-1"
        :headers="headers"
        :items="items"
        :items-per-page.sync="itemsPerPage"
        :loading="isFetching"
        must-sort
        :page.sync="page"
        :server-items-length="totalItem"
        show-select
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        @update:sort-by="onUpdateSort"
        @update:sort-desc="onUpdateSort"
      >
        <template #top>
          <div class="d-flex align-center mx-2">
            <v-menu left offset-y>
              <template #activator="{ on }">
                <transition mode="out-in" name="slide-fade">
                  <v-btn v-show="selectedItems.length" v-on="on">
                    {{ $t('common.action.choose') }}
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </transition>
              </template>
              <v-list>
                <v-list-item v-if="$acl.permission('users.delete')" dense @click="bulkDeleteUsers">
                  <v-list-item-icon>
                    <v-icon color="error" small>mdi-delete-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ $t('common.action.delete') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-spacer />
            <v-btn icon :loading="isFetching" @click="execute">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </div>
        </template>
        <template #item.index="{ index }">
          <span>{{ index + 1 }}</span>
        </template>
        <template #item.email="{ item }">
          <span class="caption font-weight-bold">{{ item.email }}</span>
        </template>
        <template #item.roles="{ item }">
          <role-select v-model="item.roles" @change="updateRoles(item)" />
        </template>
        <template #item.createdAt="{ item }">
          <span>{{ item.createdAt | formatDate }}</span>
        </template>
        <template #item.action="{ item }">
          <v-btn v-if="$acl.permission('users.edit')" color="accent" icon small @click="changePassword(item.id)">
            <v-icon>mdi-account-key-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="$acl.permission('users.edit')"
            color="info"
            icon
            small
            :to="{ name: 'users-edit-id', params: { id: item.id } }"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn v-if="$acl.permission('users.delete')" color="error" icon small @click="deleteUser(item)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </template>
      </app-data-table>
    </v-card>
    <change-password ref="changePassword" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import { map } from 'lodash'
import { useGetUsers } from '@/composables'
import Breadcrumbs from '@/components/common/molecules/Breadcrumbs'
import ListFilter from '@/components/users/molecules/ListFilter'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import RoleSelect from '@/components/users/atoms/RoleSelect'
import ChangePassword from '@/components/users/molecules/ChangePassword'

export default defineComponent({
  components: {
    Breadcrumbs,
    ListFilter,
    AppDataTable,
    RoleSelect,
    ChangePassword
  },
  setup(_, { root }) {
    const { $api, $dialog, $toast } = useContext()
    const route = useRoute()
    const routeQuery = route.value.query
    const search = ref(routeQuery.q)
    const sortBy = ref(routeQuery.order || 'createdAt')
    const sortDesc = ref(routeQuery.orderDir ? routeQuery.orderDir === 'desc' : true)
    const state = reactive({
      filter: Object.assign({
        q: search,
        roles: routeQuery.roles ? routeQuery.roles.split(',').map((e) => parseInt(e)) : null,
        order: sortBy.value,
        orderDir: sortDesc.value ? 'desc' : 'asc'
      }),
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false },
        { text: root.$t('common.model.email'), value: 'email' },
        { text: root.$t('common.model.name'), value: 'name' },
        { text: root.$t('user.model.roles'), value: 'roles', width: '250px', sortable: false },
        { text: root.$t('common.model.createdAt'), value: 'createdAt' },
        { text: '', value: 'action', align: 'right', sortable: false }
      ],
      selectedItems: []
    })

    const {
      state: listState,
      conditions,
      isFetching,
      execute,
      resetConditions,
      page,
      itemsPerPage
    } = useGetUsers(state.filter)

    const onUpdateSort = () => {
      conditions.order = sortBy.value
      conditions.orderDir = sortDesc.value ? 'desc' : 'asc'
    }

    const resetFilter = () => {
      state.filter.q = null
      state.filter.roles = null
      resetConditions(state.filter)
    }

    const updateRoles = (item) => {
      $api.user.updateRoles(item.id, { roles: item.roles }).then(() => {
        execute()
        $toast.success(root.$t('common.notice.success'))
      })
    }

    const deleteUser = (data) => {
      $dialog
        .confirm({
          title: root.$t('common.message.confirmTitle'),
          text: root.$t('common.message.confirmDeletionMessage'),
          type: 'warning',
          actions: {
            false: root.$t('common.action.cancel'),
            true: root.$t('common.action.confirm')
          }
        })
        .then((confirm) => {
          if (confirm) {
            $api.user.deleteUser(data.id).then(() => {
              $toast.success(root.$t('common.notice.success'))
              execute()
            })
          }
        })
    }

    const bulkDeleteUsers = () => {
      $dialog
        .warning({
          title: root.$t('common.message.confirmTitle'),
          text: root.$t('common.message.confirmDeletionMessage'),
          type: 'warning',
          actions: {
            false: root.$t('common.action.cancel'),
            true: root.$t('common.action.confirm')
          }
        })
        .then((confirm) => {
          if (confirm) {
            $api.user.bulkDeleteUsers({ ids: map(state.selectedItems, 'id') }).then(() => {
              $toast.success(root.$t('common.notice.success'))
              execute()
              state.selectedItems = []
            })
          }
        })
    }

    return {
      search,
      sortBy,
      sortDesc,
      filter: toRef(state, 'filter'),
      headers: toRef(state, 'headers'),
      selectedItems: toRef(state, 'selectedItems'),
      items: toRef(listState, 'items'),
      totalItem: toRef(listState, 'totalItem'),
      conditions,
      isFetching,
      execute,
      page,
      itemsPerPage,
      onUpdateSort,
      resetFilter,
      updateRoles,
      deleteUser,
      bulkDeleteUsers
    }
  },
  methods: {
    changePassword(id) {
      this.$refs.changePassword.open(id)
    }
  }
})
</script>
