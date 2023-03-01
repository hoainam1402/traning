<template>
  <v-card>
    <v-row class="align-center pa-2" dense>
      <v-col cols="6">
        <v-menu left offset-y>
          <template #activator="{ on }">
            <transition mode="out-in" name="slide-fade">
              <v-btn v-show="selectedItems.length > 0" v-on="on">
                {{ $t('common.action.choose') }}
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </transition>
          </template>
          <v-list>
            <v-list-item dense @click="bulkDeleteUnits">
              <v-list-item-icon>
                <v-icon color="error" small>mdi-delete-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ $t('common.action.delete') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col class="d-flex align-center text-right" cols="6">
        <v-text-field
          v-model="conditions.q"
          append-icon="mdi-magnify"
          class="mr-2"
          clearable
          dense
          hide-details
          :placeholder="$t('common.filter.search')"
          solo
        />
      </v-col>
    </v-row>
    <app-data-table
      v-model="selectedItems"
      :headers="headers"
      :items="items"
      :items-per-page.sync="conditions.limit"
      :loading="loading"
      :page.sync="conditions.page"
      show-select
    >
      <template #item.index="{ index }">
        <div>{{ index + 1 }}</div>
      </template>
      <template #item.name="{ item }">
        <edit-unit :item="item" @refresh="fetchData" />
      </template>
      <template #item.action="{ item }">
        <v-btn color="error" icon small @click="deleteUnit(item)">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </template>
    </app-data-table>
  </v-card>
</template>

<script>
import { map, throttle } from 'lodash'
import { defineComponent, reactive, toRef, useContext, onMounted } from '@nuxtjs/composition-api'
import EditUnit from '@/components/unit/molecules/EditUnit'
import AppDataTable from '@/components/common/atoms/AppDataTable'

export default defineComponent({
  name: 'ListUnit',
  components: {
    EditUnit,
    AppDataTable
  },
  props: {
    errors: {
      type: Object,
      default: () => ({})
    },
    drawer: {
      type: Boolean
    }
  },
  setup(_, { root }) {
    const { $api, $toast, $dialog } = useContext()

    const state = reactive({
      loading: false,
      headers: [
        { text: root.$t('common.model.id'), value: 'id' },
        { text: root.$t('unit.model.name'), value: 'name' },
        { text: '', value: 'action', align: 'right' }
      ],
      items: [],
      conditions: {
        limit: 10,
        page: 1
      },
      selectedItems: []
    })

    onMounted(() => {
      fetchData()
    })

    const fetchData = async () => {
      try {
        state.loading = true
        const { data } = await $api.unit.getUnits(state.conditions)
        state.items = data
        state.loading = false
      } catch (e) {
        window.console.error(e)
      }
    }

    const deleteUnit = (item) => {
      $dialog
        .warning({
          text: root.$t('common.message.confirmDeletionMessage'),
          title: root.$t('common.message.warning'),
          actions: {
            false: root.$t('common.action.cancel'),
            true: root.$t('common.action.confirm')
          }
        })
        .then((confirm) => {
          if (confirm) {
            $api.unit.deleteUnit(item.id).then(() => {
              $toast.success(root.$t('common.notice.success'))
              fetchData()
            })
          }
        })
    }

    const bulkDeleteUnits = () => {
      $dialog
        .warning({
          text: root.$t('common.message.confirmDeletionMessage'),
          title: root.$t('common.message.warning'),
          actions: {
            false: root.$t('common.action.cancel'),
            true: root.$t('common.action.confirm')
          }
        })
        .then((confirm) => {
          if (confirm) {
            $api.unit.bulkDeleteUnits({ ids: map(state.selectedItems, 'id') }).then(() => {
              state.selectedItems = []
              $toast.success(root.$t('common.notice.success'))
              fetchData()
            })
          }
        })
        .catch((e) => {
          this.isLoading = false
          window.console.error(e)
        })
    }

    return {
      loading: toRef(state, 'loading'),
      headers: toRef(state, 'headers'),
      items: toRef(state, 'items'),
      conditions: toRef(state, 'conditions'),
      selectedItems: toRef(state, 'selectedItems'),
      fetchData,
      deleteUnit,
      bulkDeleteUnits
    }
  },
  watch: {
    conditions: {
      handler: throttle(function () {
        this.fetchData(this.conditions)
      }, 150),
      deep: true
    },
    drawer: {
      handler(val) {
        if (val === true) {
          this.fetchData()
        }
      }
    }
  }
})
</script>
