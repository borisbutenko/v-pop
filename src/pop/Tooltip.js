import { uniqueId } from 'lodash'
import Popper from 'popper.js'

class Tooltip {
  _id = uniqueId('tooltip_')
  _opened = false
  _container = null

  constructor(reference, options, context) {
    this._vm = context
    this.reference = reference
    this.options = options
  }

  create_tooltip_container(container = Tooltip.container) {
    this._container = container
    this._container.id = this._id
    this._container.innerHTML = this.options.content
    this._container.className = 'v-pop-popper'
    this._container.dataset.state = 'hidden'
  }

  set_attributes() {
    this.reference.className = 'v-pop-reference'
    this.reference.dataset.action = this.options.trigger
    this.reference.dataset.state = 'hidden'
    this.reference.dataset.id = this._id
  }

  show() {
    Tooltip.hide_all()

    // --- append if first show
    if (!document.getElementById(this._id)) {
      document.body.appendChild(this._container)
    }

    // --- immediate coz hide_all is called
    // --- after document click or this method
    setImmediate(() => {
      this.opened = true
      this.reference.dataset.state = 'visible'
      this._container.dataset.state = 'visible'
      this._vm.$emit('v-pop', this.opened)
    })
  }

  hide() {
    this.opened = false
    this.reference.dataset.state = 'hidden'
    this._container.dataset.state = 'hidden'
    this._vm.$emit('v-pop', this.opened)
  }

  init() {
    this.set_attributes()
    this.create_tooltip_container()
    this.init_popper()
    Tooltip.set_events(this)
    Tooltip.add(this)
  }

  init_popper() {
    this.popper = new Popper(this.reference, this._container, this.options.popper)
  }

  destroy() {
    Tooltip.remove(this)
  }

  // --- getters

  get opened() {
    return this._opened
  }

  // --- setters

  set opened(value) {
    this._opened = value
  }

  // --- static methods

  static set_events(instance) {
    let trigger = instance.options.trigger

    if (Tooltip.events.has(trigger)) {
      return
    }

    let container = instance._vm.$root.$el || document.body

    switch (trigger) {
      case 'hover':
        container.addEventListener('mouseover', Tooltip.handler_mouseover, false)
        container.addEventListener('mouseout', Tooltip.handler_mouseout, false)
        break
      case 'click':
        container.addEventListener('click', Tooltip.handler_click, false)
        if (!Tooltip.events.has('click')) {
          document.addEventListener('click', ({ target }) => {
            if (target.closest('.v-pop-reference[data-action="hover"][data-state="visible"]')) {
              return
            }
            Tooltip.hide_all()
          }, false)
        }
        break
      default:
        break
    }

    Tooltip.events.add(trigger)
  }

  static hide_all() {
    for (let instance of Tooltip.instance.values()) {
      if (instance.opened) {
        instance.hide()
      }
    }
  }

  static handler_click({ target }) {
    target = target.closest('.v-pop-reference[data-action="click"][data-state="hidden"]')
    if (!target) {
      return
    }
    let instance = Tooltip.get_instance(target.dataset.id)
    if (!instance) {
      return
    }
    if (target.dataset.state === 'visible') {
      instance.hide()
    } else {
      instance.show()
    }
  }

  static handler_mouseover({ target }) {
    target = target.closest('.v-pop-reference[data-action="hover"][data-state="hidden"]')
    if (!target) {
      return
    }

    let instance = Tooltip.get_instance(target.dataset.id)
    if (!instance) {
      return
    }
    if (instance.opened) {
      return
    }

    instance.show()
  }

  static handler_mouseout({ target, toElement }) {
    let selector = '.v-pop-reference[data-action="hover"][data-state="visible"]'

    target = target.closest(selector)
    toElement = toElement && toElement.closest(selector)

    if (!target || (toElement && target)) {
      return
    }

    let instance = Tooltip.get_instance(target.dataset.id)
    if (!instance) {
      return
    }
    if (!instance.opened) {
      return
    }

    instance.hide()
  }

  static add(instance) {
    Tooltip.instance.set(instance._id, instance)
  }

  static remove(instance) {
    // document.body.remove(instance.content)
    Tooltip.instance.delete(instance._id)
  }

  static get_instance(id) {
    return Tooltip.instance.get(id)
  }

  // --- static getters

  static get container() {
    return document.createElement('div')
  }
}

Tooltip.instance = new Map()
Tooltip.events = new Set()

export default Tooltip
