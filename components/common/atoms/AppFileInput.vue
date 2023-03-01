<template>
  <validation-provider v-slot="{ errors }" :name="name || $attrs.label" :rules="rules" :vid="vid">
    <v-file-input
      v-model="innerValue"
      v-bind="$attrs"
      :dense="dense"
      :error-messages="errors"
      :hide-details="errors.length === 0 && !!!$attrs.hint"
      :outlined="outlined"
      v-on="$listeners"
    >
      <template v-if="!!$attrs.label" slot="label">
        {{ $attrs.label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    </v-file-input>
  </validation-provider>
</template>

<script>
import ControlMixin from '@/mixins/control'

export default {
  name: 'AppFileInput',
  mixins: [ControlMixin]
}
</script>
