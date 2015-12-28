var engine = require('player-engine')()
var coversActions = require('./covers.js')

var actions = {

  // Synchronize the player engine with the loaded state
  PLAYER_SYNCHRONIZE: () => {
    return (dispatch, getState) => {
      // Bind the event listeners to the actions
      engine.on('timeupdate', duration => dispatch(actions.PLAYER_CURRENT_DURATION(duration)))
      engine.on('ended', () => dispatch(actions.PLAYBACK_NEXT()))

      // Get the current state (just after loading)
      const state = getState()

      // Set the old volume and reset playing status
      actions.PLAYER_SET_VOLUME(state.player.volume)
      dispatch(actions.PLAYER_SET_PLAYING(false))

      // Get the filename of the last played song
      const song = getSong(state.player.songId, state)
      const filename = song ? song.filename : false
      if (!filename) {
        // Old file is not here anymore :(
        dispatch(actions.PLAYER_CURRENT_DURATION(0))
      } else {
        // Old file is still here, let's load it! :)
        engine.load(filename)
        engine.seek(state.player.currentDuration)
        coversActions.GET_COVER(song.album, song.artist, song.coverId)(dispatch, getState)
      }
    }
  },

  // Set the player engine to play a song
  PLAYER_SET_SONG: (id, ignoreHistory = false) => {
    return (dispatch, getState) => {
      var state = getState()

      // Don't write multiple times in the history if we are playing the same song
      if (state.player.songId === id) {
        ignoreHistory = true
      }

      // Get the song and the filename
      const song = getSong(id, state)
      const filename = song ? song.filename : false

      // Load and play the file in the engine
      engine.load(filename)
      engine.play()

      // Try and load an cover art
      coversActions.GET_COVER(song.album, song.artist, song.coverId)(dispatch, getState)

      // Update the view
      dispatch({
        type: 'PLAYER_SET_SONG',
        id,
        ignoreHistory
      })
    }
  },

  // Set the playing status to true or false
  PLAYER_SET_PLAYING: (playing) => {
    (playing) ? engine.play() : engine.pause()
    return {
      type: 'PLAYER_SET_PLAYING',
      playing
    }
  },

  // Seek to a position in the player
  PLAYER_SEEK: (duration) => {
    engine.seek(duration)
    return {
      type: 'PLAYER_CURRENT_DURATION',
      duration
    }
  },

  // Set the volume ofo the player
  PLAYER_SET_VOLUME: (volume) => {
    engine.volume(volume)
    return {
      type: 'PLAYER_SET_VOLUME',
      volume
    }
  },

  // Update the current duration of the player
  PLAYER_CURRENT_DURATION: (currentDuration) => {
    return {
      type: 'PLAYER_CURRENT_DURATION',
      currentDuration
    }
  },

  // Set the previous song for the player out of the history
  PLAYBACK_BACK: () => {
    return (dispatch, getState) => {
      const history = getState().player.history
      var id = history.songs[history.currentIndex - 1]
      dispatch(actions.PLAYER_SET_SONG(id, true))
      dispatch({
        type: 'HISTORY_BACK'
      })
    }
  },

  // Set the next song for the player
  PLAYBACK_NEXT: () => {
    return (dispatch, getState) => {
      const history = getState().player.history

      // We have a history entry set, let's use that one.
      if (history.songs.length - 1 > history.currentIndex) {
        const id = history.songs[history.currentIndex + 1]
        dispatch(actions.PLAYER_SET_SONG(id, true))
        dispatch({
          type: 'HISTORY_NEXT'
        })
        return
      }

      // Nothing set, let's randomly play something :(
      console.log('No songs set, random song playing')
      const songs = getState().songs
      const id = songs[Math.floor(Math.random() * songs.length)].id
      dispatch(actions.PLAYER_SET_SONG(id))
    }
  }

}

// Get the song off the state based on a song id
function getSong (songId, state) {
  return state.songs.filter(x => x.id === songId)[0]
}

module.exports = actions
