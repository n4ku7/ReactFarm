// Validation utilities
export const validators = {
  email: (value) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Please enter a valid email address'
    return ''
  },
  
  password: (value) => {
    if (!value) return 'Password is required'
    if (value.length < 6) return 'Password must be at least 6 characters'
    if (value.length > 50) return 'Password must be less than 50 characters'
    return ''
  },
  
  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password'
    if (value !== password) return 'Passwords do not match'
    return ''
  },
  
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`
    }
    return ''
  },
  
  phone: (value) => {
    if (!value) return 'Phone number is required'
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number'
    }
    return ''
  },
  
  zipCode: (value) => {
    if (!value) return 'ZIP code is required'
    const zipRegex = /^\d{5,6}(-\d{4})?$/
    if (!zipRegex.test(value)) return 'Please enter a valid ZIP code'
    return ''
  },
  
  minLength: (value, min, fieldName = 'This field') => {
    if (!value) return `${fieldName} is required`
    if (value.length < min) return `${fieldName} must be at least ${min} characters`
    return ''
  },
  
  maxLength: (value, max, fieldName = 'This field') => {
    if (value && value.length > max) return `${fieldName} must be less than ${max} characters`
    return ''
  },
  
  number: (value, fieldName = 'This field') => {
    if (!value) return `${fieldName} is required`
    if (isNaN(value) || parseFloat(value) <= 0) return `${fieldName} must be a positive number`
    return ''
  },
  
  positiveNumber: (value, fieldName = 'This field') => {
    if (!value) return `${fieldName} is required`
    const num = parseFloat(value)
    if (isNaN(num) || num <= 0) return `${fieldName} must be a positive number`
    return ''
  }
}

export const validateForm = (formData, rules) => {
  const errors = {}
  let isValid = true
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = formData[field]
    
    for (const rule of fieldRules) {
      let error = ''
      if (typeof rule === 'function') {
        error = rule(value, formData)
      } else if (typeof rule === 'string' && validators[rule]) {
        error = validators[rule](value)
      }
      
      if (error) {
        errors[field] = error
        isValid = false
        break
      }
    }
  })
  
  return { errors, isValid }
}

