const React = require('react')
const ReactDOM = require('react-dom')
const { connect } = require('react-redux')
const { RECEIVE_INVITE } = require('../../actions')

class ReceiveInviteForm extends React.Component {
  onSubmit (e) {
    e.preventDefault()

    var description = ReactDOM.findDOMNode(this.refs.description)
    var friendUrl = ReactDOM.findDOMNode(this.refs.friendUrl)

    if (friendUrl.value === '') {
      window.alert('A friend URL is needed')
      return
    }

    this.props.RECEIVE_INVITE(description.value, friendUrl.value)

    description.value = ''
    friendUrl.value = ''

    return false
  }

  render () {
    return (
        <form className='pretty-form' onSubmit={(e) => this.onSubmit(e)}>
          <div>
            <label>
              Description
            </label>
            <input type='text' placeholder='Joe from Work' ref='description'/>
          </div>
          <div className='no-border'>
            <label>
              Friend URL
            </label>
            <textarea placeholder='web+peermusic://INVITE#host:port#pubKey#signPrivKey' ref='friendUrl' defaultValue={this.props.defaultValue}/>
          </div>

          <div className='no-border'>
            <input type='submit' value='Add new friend'/>
          </div>
        </form>
    )
  }
}

ReceiveInviteForm.propTypes = {
  defaultValue: React.PropTypes.string,
  RECEIVE_INVITE: React.PropTypes.func
}

module.exports = connect((state) => {
  const defaultValue = /^.*\?default=(.*)$/.exec(state.routing.path)
  return {
    defaultValue: defaultValue ? decodeURIComponent(defaultValue[1]) : ''
  }
}, {RECEIVE_INVITE})(ReceiveInviteForm)