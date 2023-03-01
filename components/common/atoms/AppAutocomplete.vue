<template>
  <validation-provider v-slot="{ errors }" :name="name || $attrs.label" :rules="rules" :vid="vid">
    <v-autocomplete
      v-model="innerValue"
      v-bind="$attrs"
      :clearable="clearable"
      :dense="dense"
      :error-messages="errors"
      :hide-details="errors.length === 0 && !!!$attrs.hint"
      :item-text="itemText"
      :item-value="itemValue"
      :items="items"
      :outlined="outlined"
      :search-input.sync="search"
      v-on="$listeners"
      @update:search-input="handleSearch"
    >
      <template v-if="!!$attrs.label" slot="label">
        {{ $attrs.label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
        <slot v-bind="scope" :name="slot" />
      </template>
    </v-autocomplete>
  </validation-provider>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppAutocomplete',
  mixins: [ControlMixin],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'name'
    },
    itemValue: {
      type: String,
      default: 'id'
    },
    searchInput: {
      type: String,
      default: null
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    search: {
      get() {
        return this.searchInput
      },
      set(val) {
        this.$emit('update:search-input', val)
      }
    }
  },
  methods: {
    handleSearch(val) {
      this.$emit('search-input', val)
    }
  }
}
</script>
