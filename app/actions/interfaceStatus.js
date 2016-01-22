var actions = {

  // Hide the initial popover on first application startup
  HIDE_INITIAL_POPOVER: () => {
    return {
      type: 'HIDE_INITIAL_POPOVER'
    }
  },

  // Show / hide the playing next panel on the right side
  TOGGLE_PLAYING_NEXT_PANEL: () => {
    return {
      type: 'TOGGLE_PLAYING_NEXT_PANEL'
    }
  },

  // Toggle the navigation state for mobile
  TOGGLE_MOBILE_NAVIGATION: () => ({
    type: 'TOGGLE_MOBILE_NAVIGATION'
  }),

  // Toggle desktop notifications
  TOGGLE_DESKTOP_NOTIFICATIONS: () => ({
    type: 'TOGGLE_DESKTOP_NOTIFICATIONS'
  })

}

module.exports = actions
