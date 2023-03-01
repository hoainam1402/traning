<template>
  <nuxt />
</template>

<script>
export default {
  middleware({ redirect }) {
    return redirect({ name: 'setting-roles' })
  }
}
</script>
