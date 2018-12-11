export function get_options(value = {}, modifiers = {}, context = {}) {
  let options = {}
  let { trigger = '', content = '' } = value
  let template = content || value

  if (context.$store && context.$store.state.trigger) {
    trigger = context.$store.state.trigger
  }

  switch (typeof template) {
    case 'string':
      options.content = template
      break
    case 'function':
      options.content = template.call(context)
      break
    case 'object':
      options.content = template.content
      break
    default:
      options.content = ''
      break
  }

  options.popper = {}
  options.timeout = Infinity
  options.trigger = trigger || get_trigger(modifiers)
  options.content = options.content || ''

  return options
}

export function get_trigger(modifiers) {
  if ('click' in modifiers) {
    return 'click'
  } else {
    return 'hover'
  }
}
