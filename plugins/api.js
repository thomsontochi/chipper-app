import { pickBy } from 'lodash-es'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  function request (method, url, params, headers) {
    const tokenCookie = useCookie('jwt')
    const couponCookie = useCookie('coupon')
    const utmCookie = useCookie('utm')

    const hasBody = ['POST', 'PATCH', 'PUT'].includes(method)
    const body = hasBody ? params : undefined
    const query = !hasBody ? params : undefined
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

    return $fetch(url, {
      method,
      body,
      query,
      baseURL: config.public.API_URL,
      headers: pickBy({
        ...headers,
        Accept: 'application/json',
        'Content-Type': isFormData ? null : 'application/json',
        Authorization: tokenCookie?.value ? `Bearer ${tokenCookie.value}` : null,
        'X-Coupon': couponCookie?.value,
        'X-UTM': JSON.stringify(toRaw(utmCookie?.value))
      }),
      onRequest (arg) {
        console.info('[fetch request]', arg.request)
      },
      onRequestError (arg) {
        console.info('[fetch request error]', arg.request, arg.error)
      },
      onResponse (arg) {
        console.info('[fetch response]', arg.request, arg.response.status)
      },
      onResponseError (arg) {
        console.info('[fetch response error]', arg.request, arg.response.status)
      }
    })
  }

  const api = {
    get (url, params = {}, headers = {}) {
      return request('GET', url, params, headers)
    },
    post (url, params = {}, headers = {}) {
      return request('POST', url, params, headers)
    },
    patch (url, params = {}, headers = {}) {
      return request('PATCH', url, params, headers)
    },
    put (url, params = {}, headers = {}) {
      return request('PUT', url, params, headers)
    },
    delete (url, params = {}, headers = {}) {
      return request('DELETE', url, params, headers)
    }
  }

  return {
    provide: {
      api
    }
  }
})
