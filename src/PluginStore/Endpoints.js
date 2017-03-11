import { isString } from 'lodash'

export function identifierToArray (endpoint = []) {
  if (Array.isArray(endpoint)) {
    return endpoint
  } else if (endpoint == null) {
    return []
  } else if (isString(endpoint)) {
    return endpoint.split('.')
  } else {
    throw new Error('Invalid endpoint identifier type : ' + endpoint)
  }
}

export function identifierToString (endpoint = []) {
  if (isString(endpoint)) {
    return endpoint
  } else if (Array.isArray(endpoint)) {
    if (endpoint.length === 0) {
      return null
    } else {
      return endpoint.join('.')
    }
  } else if (endpoint == null) {
    return null
  } else {
    throw new Error('Invalid endpoint identifier type : ' + endpoint)
  }
}

export default {
  identifierToArray,
  identifierToString
}
