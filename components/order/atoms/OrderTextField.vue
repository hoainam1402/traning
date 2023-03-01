<template>
  <validation-provider v-slot="{ errors }" :name="name || $attrs.label" :rules="rules" :vid="vid">
    <v-text-field
      v-model="innerValue"
      v-bind="$attrs"
      :dense="dense"
      hide-details
      :outlined="outlined"
      v-on="$listeners"
    >
      <template v-if="!!$attrs.label" slot="label">
        {{ $attrs.label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <template slot="append">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon v-show="errors[0]" color="error" v-bind="attrs" v-on="on">mdi-alert-decagram-outline</v-icon>
          </template>
          <span>
            {{ errors[0] }}
          </span>
        </v-tooltip>
      </template>
    </v-text-field>
  </validation-provider>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'OrderTextField',
  mixins: [ControlMixin]
}
</script>
