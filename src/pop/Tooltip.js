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
    this.reference.dataset.container = `#${this._id}`
  }

  set_events() {
    let trigger = this.options.trigger

    switch (trigger) {
      case 'hover':
        this.reference.addEventListener('mouseenter', this.show.bind(this), false)
        this.reference.addEventListener('mouseleave', this.hide.bind(this), false)
        break
      case 'click':
        this.reference.addEventListener('click', () => {
          if (this.opened) {
            this.hide()
          } else {
            this.show()
          }
        }, false)
        if (!Tooltip.events.has('click')) {
          document.addEventListener('click', Tooltip.hide_all, false)
        }
        break
      default:
        break
    }

    Tooltip.events.add(trigger)
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
      this._container.dataset.state = 'visible'
      this._vm.$emit('v-pop', this.opened)
    })
  }

  hide() {
    this.opened = false
    this._container.dataset.state = 'hidden'
    this._vm.$emit('v-pop', this.opened)
  }

  init() {
    this.set_events()
    this.set_attributes()
    this.create_tooltip_container()
    this.init_popper()
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

  static hide_all() {
    for (let instance of Tooltip.instance.values()) {
      if (instance.opened) {
        instance.hide()
      }
    }
  }

  static add(instance) {
    Tooltip.instance.set(instance._id, instance)
  }

  static remove(instance) {
    // document.body.remove(instance.content)
    Tooltip.instance.delete(instance._id)
  }

  // --- static getters

  static get container() {
    return document.createElement('div')
  }
}

Tooltip.instance = new Map()
Tooltip.events = new Set()

export default Tooltip
