import Vue from 'vue'

export function get_options(value = {}, { modifiers = {}, arg = null }, context = {}) {
  let options = {}
  let { trigger = '', content = '' } = value
  let template = content || value

  if (context.$store && context.$store.state.trigger) {
    trigger = context.$store.state.trigger
  }

  if (!arg) {
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
  } else {
    // --- тут я явно указываю ссылку на компонент
    // --- в нормальной реализации нужно
    // --- засплитить строку по '-' и заапперкейскить 0 символ
    // --- каждого элемента и заджоинить по ''
    let c = context.$options.components.TooltipContent
    options.content = new Vue({
      data: {
        value
      },
      watch: {
        value: {
          immediate: true,
          deep: true,
          handler(value) {
            this.value = value
            this.$emit('input', value)
          }
        }
      },
      render: c.render
    }).$mount().$el.innerHTML
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
