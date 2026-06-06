export default async function useTodosFetch({token, params = {}}) {
  const queryParams = new URLSearchParams(params)

  const resp = await fetch(`/api/tasks?${queryParams}`, {
    method: 'GET',
    headers: {
      'X-CSRF-TOKEN': token,
    },
    credentials: 'include'
  })

  return resp
}
