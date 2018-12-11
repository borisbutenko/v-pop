import { get_options } from './utils'
import Tooltip from './Tooltip'

export default {
  bind(el, { value, modifiers }, { context }) {
    el.tooltip = new Tooltip(el, get_options(value, modifiers, context), context)
  },

  inserted(el) {
    el.tooltip.init()
  },

  unbind(el) {
    el.tooltip.destroy()
  }
}

// export default {
//   bind(el, { value, modifiers }) {
//     let options = get_options(value, modifiers)
//   },

//   inserted() {

//   },

//   unbind() {

//   }
// }
