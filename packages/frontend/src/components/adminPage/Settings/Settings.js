import React, { PropTypes } from 'react'
import classnames from 'classnames'
import ErrorMessage from 'components/common/ErrorMessage'
import DesignSettings from 'components/adminPage/DesignSettings'
import GeneralSettings from 'components/adminPage/GeneralSettings'
import NotificationsSettings from 'components/adminPage/NotificationsSettings'
import classes from './Settings.scss'

const tabs = [
  { name: 'General', component: GeneralSettings },
  { name: 'Design', component: DesignSettings },
  { name: 'Notifications', component: NotificationsSettings }
]

export default class Settings extends React.Component {
  static propTypes = {
    fetchSettings: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isFetching: false,
      message: '',
      tabIndex: 0
    }
  }

  callbacks = {
    onLoad: () => { this.setState({isFetching: true}) },
    onSuccess: () => { this.setState({isFetching: false, message: ''}) },
    onFailure: (msg) => {
      this.setState({isFetching: false, message: msg})
    }
  }

  componentDidMount () {
    this.props.fetchSettings(this.callbacks)
  }

  handleSelectTab = (i) => {
    return () => {
      this.setState({ tabIndex: i })
    }
  }

  renderTab = (tab, i) => {
    let tabClass = 'unselected-tab'
    if (i === this.state.tabIndex) {
      tabClass = 'selected-tab'
    }
    return (
      <span key={tab.name} className={classnames(classes['tab'], classes[tabClass])} onClick={this.handleSelectTab(i)}>
        {tab.name}
      </span>
    )
  }

  renderTabs = () => {
    return (
      <div className={classes.tabs}>
        {tabs.map(this.renderTab)}
        <span key='padding' className={classes['padding']} />
      </div>
    )
  }

  render () {
    let errMsg
    if (this.state.message) {
      errMsg = (<ErrorMessage message={this.state.message} />)
    }

    let tabContent = React.createElement(tabs[this.state.tabIndex].component, {})
    return (
      <div className={classes.layout}
        style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
        <h4>Settings</h4>
        {errMsg}
        {this.renderTabs()}
        {tabContent}
      </div>
    )
  }
}
