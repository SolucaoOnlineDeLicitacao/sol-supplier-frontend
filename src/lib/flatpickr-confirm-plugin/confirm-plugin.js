/**
 * Plugin to keep an always-visible confirm button on flatpickr for enhanced UX (e.g. date and time
 * pickers, or multiple date pickers).
 *
 * It appends HTML elements to flatpickr:
 * ```html
 * <div class="flatpickr-confirm visible">
 *   <!--
 *     Here, in the textContent, we add "confirmText" config value, which defaults to "OK ".
 *     You can customize with "Done", for example.
 *   -->
 *   OK
 *
 *   <!--
 *     This is the "confirmIcon" config value, which defaults to SVG.
 *     Try '<i class="fa fa-check"></i>' for FontAwesome icons.
 *   -->
 *   <svg ...></svg>
 *
 * </div>
 * ````
 *
 * based on official "confirmDate" plugin
 * @see https://github.com/flatpickr/flatpickr/blob/master/src/plugins/confirmDate/confirmDate.ts
 * issues:
 *   https://github.com/flatpickr/flatpickr/issues/1259
 */

const DEFAULT_CONFIG = {
  confirmIcon: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='17' height='17' viewBox='0 0 17 17'> <g> </g> <path d='M15.418 1.774l-8.833 13.485-4.918-4.386 0.666-0.746 4.051 3.614 8.198-12.515 0.836 0.548z' fill='#000000' /> </svg>",
  confirmText: 'OK ', // an extra space between V icon from SVG
  theme:       'light' // allows specific styling with "${theme}Theme classes"
}

function confirmPlugin(pluginConfig = {}) {
  let config = Object.assign({}, DEFAULT_CONFIG, pluginConfig)
  let confirmContainer = null

  // a plugin is basically a factory function. It returns a "plugin function"
  return function confirmPluginBuilder(flatpickr) {
    // ignoring it for mobile devices, making them use the native date/datepicker input
    if (flatpickr.isMobile) return {}

    let hooks = Object.assign({
      onKeyDown(_, __, ___, e) {
        // handling TAB focus on "confirm button"
        if (e.key === 'Tab' && e.target === flatpickr.amPM) {
          e.preventDefault()
          confirmContainer.focus()

        // handling ENTER on "confirm button"
        } else if (e.key === 'Enter' && e.target === confirmContainer) {
          flatpickr.close()
        }
      },

      // on ready, creates the UO
      onReady() {
        confirmContainer = flatpickr._createElement(
          'div',
          `flatpickr-confirm visible ${config.theme}Theme`,
          config.confirmText
        )
        confirmContainer.tabIndex = -1
        confirmContainer.innerHTML += config.confirmIcon
        confirmContainer.addEventListener('click', flatpickr.close)
        flatpickr.calendarContainer.appendChild(confirmContainer)
      }
    })

    return hooks
  }
}

export default confirmPlugin
