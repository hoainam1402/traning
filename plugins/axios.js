export default function ({ $axios, $toast, store, redirect }) {
  $axios.onResponse((response) => {
    return response
  })

  $axios.onError((error) => {
    $toast.error(error.response?.data?.error?.message)

    if (error.response?.data?.error?.fields) {
      store.commit('form/VALIDATION_ERRORS', error.response?.data?.error?.fields)
    }

    const code = error.response?.status
    if (code === 401) {
      redirect('/login')
    }
  })
}
