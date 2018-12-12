import { get_options } from './utils'
import Tooltip from './Tooltip'

export default {
  bind(el, { value, modifiers, arg }, { context }) {
    el.tooltip = new Tooltip(el, get_options(value, { modifiers, arg }, context), context)
  },

  inserted(el) {
    el.tooltip.init()
  },

  unbind(el) {
    el.tooltip.destroy()
  }
}
