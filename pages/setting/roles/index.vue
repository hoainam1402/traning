<template>
  <div class="tw-w-full">
    <portal to="title">
      {{ $t('role.title') }}
    </portal>
    <portal to="action">
      <v-btn color="primary" @click="createRole">
        {{ $t('role.action.create') }}
      </v-btn>
    </portal>
    <v-card class="tw-w-full overflow-auto">
      <v-card-text>
        <app-data-table
          class="flex-grow-1"
          :headers="headers"
          :items="items"
          :items-per-page.sync="itemsPerPage"
          :loading="isFetching"
          must-sort
          :page.sync="page"
          :server-items-length="totalItem"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @update:sort-by="onUpdateSort"
          @update:sort-desc="onUpdateSort"
        >
          <template #item.index="{ index }">
            <span>{{ index + 1 }}</span>
          </template>
          <template #item.action="{ item }">
            <v-btn color="info" icon small @click="editRole(item)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn color="error" icon small @click="deleteRole(item)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>
        </app-data-table>
      </v-card-text>
    </v-card>
    <create-role ref="createRole" @success="execute" />
    <edit-role ref="editRole" @success="execute" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRef, useContext, useRoute } from '@nuxtjs/composition-api'
import { useGetRoles } from '@/composables'
import AppDataTable from '@/components/common/atoms/AppDataTable'
import CreateRole from '@/components/setting/organisms/CreateRoleDrawer'
import EditRole from '@/components/setting/organisms/EditRoleDrawer'

export default defineComponent({
  components: {
    AppDataTable,
    CreateRole,
    EditRole
  },
  setup(_, { root }) {
    const { $api, $dialog, $toast } = useContext()
    const route = useRoute()
    const routeQuery = route.value.query
    const sortBy = ref(routeQuery.order || 'name')
    const sortDesc = ref(routeQuery.orderDir ? routeQuery.orderDir === 'desc' : true)
    const state = reactive({
      filter: Object.assign({
        order: sortBy.value,
        orderDir: sortDesc.value ? 'desc' : 'asc'
      }),
      headers: [
        { text: root.$t('common.model.id'), value: 'index', align: 'left', sortable: false, width: '5%' },
        { text: root.$t('role.model.name'), value: 'name' },
        { text: root.$t('role.model.description'), value: 'description', sortable: false },
        { text: '', value: 'action', align: 'right', sortable: false }
      ]
    })
    const { state: listState, conditions, isFetching, execute, page, itemsPerPage } = useGetRoles(state.filter)

    const onUpdateSort = () => {
      conditions.order = sortBy.value
      conditions.orderDir = sortDesc.value ? 'desc' : 'asc'
    }

    const deleteRole = (data) => {
      $dialog
        .confirm({
          title: root.$t('common.message.confirmTitle'),
          text: root.$t('common.message.confirmDeletionMessage')
        })
        .then((confirm) => {
          if (confirm) {
            $api.role.deleteRole(data.id).then(() => {
              execute()
              $toast.success(root.$t('role.notice.deleteSuccess'))
            })
          }
        })
    }

    return {
      sortBy,
      sortDesc,
      filter: toRef(state, 'filter'),
      headers: toRef(state, 'headers'),
      items: toRef(listState, 'items'),
      totalItem: toRef(listState, 'totalItem'),
      conditions,
      isFetching,
      execute,
      page,
      itemsPerPage,
      onUpdateSort,
      deleteRole
    }
  },
  methods: {
    createRole() {
      this.$refs.createRole.open()
    },
    editRole(item) {
      this.$refs.editRole.open(item)
    }
  }
})
</script>
