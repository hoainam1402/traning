<template>
  <v-menu
    ref="menu"
    absolute
    :close-on-content-click="false"
    max-width="290px"
    min-width="290px"
    offset-y
    transition="scale-transition"
  >
    <template #activator="{ on, attrs }">
      <validation-provider v-slot="{ errors }" :name="name || $attrs.label" :rules="rules" :vid="vid">
        <v-text-field
          v-bind="{ ...attrs, ...$attrs }"
          v-model="innerValue"
          :clearable="clearable"
          :dense="dense"
          :error-messages="errors"
          :hide-details="errors.length === 0 && !!!$attrs.hint"
          :outlined="outlined"
          readonly
          :value="innerValue | formatDate(format)"
          v-on="on"
        >
          <template slot="append">
            <v-icon :disabled="$attrs.disabled" v-on="on">mdi-calendar</v-icon>
          </template>
          <template v-if="!!$attrs.label" slot="label">
            {{ $attrs.label }}
            <span v-if="isRequired" class="red--text">*</span>
          </template>
          <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
        </v-text-field>
      </validation-provider>
    </template>
    <v-date-picker :max="maxDate" :min="minDate" no-title :type="type" :value="innerValue" @change="save" />
  </v-menu>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppDatePicker',
  mixins: [ControlMixin],
  props: {
    maxDate: {
      type: String,
      default: null
    },
    minDate: {
      type: String,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    }
  },
  methods: {
    save(date) {
      this.innerValue = this.$moment(date).format(this.format)
      this.$refs.menu.save(date)
    }
  }
}
</script>
