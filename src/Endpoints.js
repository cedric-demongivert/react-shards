import { isString } from 'lodash'

export function identifierToArray(endpoint = []) {
  if (Array.isArray(endpoint)) {
    return endpoint
  } else if (isString(endpoint)) {
    return endpoint.split('.')
  } else {
    throw new Error('Invalid endpoint identifier type : ' + endpoint)
  }
}

export function identifierToString(endpoint = []) {
  if (Array.isArray(endpoint)) {
    return endpoint.join('.')
  } else if (isString(endpoint)) {
    return endpoint
  } else {
    throw new Error('Invalid endpoint identifier type : ' + endpoint)
  }
}

export default {
  identifierToArray,
  identifierToString
}
