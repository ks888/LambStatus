import React from 'react'
import { Provider } from 'react-redux'
import { mount, shallow } from 'enzyme'
import { metricStatuses } from 'utils/status'
import * as dialogUtil from 'utils/dialog'
import Button from 'components/common/Button'
import TextField from 'components/common/TextField'
import { monitoringServiceManager } from 'components/adminPage/MonitoringService'
import MetricDialog, { dialogType } from 'components/adminPage/MetricDialog/MetricDialog'
import classes from 'components/adminPage/MetricDialog//MetricDialog.scss'

describe('MetricDialog', () => {
  const generateProps = () => {
    return {
      onClosed: sinon.spy(),
      metricID: '1',
      metric: {
        metricID: '1',
        type: 'Self',
        props: {},
        title: 'Title',
        status: metricStatuses[0],
        unit: 'ms',
        description: 'description',
        decimalPlaces: 0,
        order: 0
      },
      dialogType: dialogType.add,
      postMetric: sinon.spy(),
      updateMetric: sinon.spy()
    }
  }

  describe('constructor', () => {
    it('should initialize state by the given metric', () => {
      const props = generateProps()
      const dialog = new MetricDialog(props)
      assert(dialog.state.type === props.metric.type)
      assert(dialog.state.props === props.metric.props)
      assert(dialog.state.title === props.metric.title)
      assert(dialog.state.status === props.metric.status)
      assert(dialog.state.unit === props.metric.unit)
      assert(dialog.state.description === props.metric.description)
      assert(dialog.state.decimalPlaces === props.metric.decimalPlaces)
      assert(dialog.state.isUpdating === false)
      assert(dialog.state.message === '')
    })

    it('should set default values if the metric is empty', () => {
      const dialog = new MetricDialog({})
      assert(dialog.state.type === monitoringServiceManager.listServices()[0])
      assert(dialog.state.props === null)
      assert(dialog.state.title === '')
      assert(dialog.state.status === metricStatuses[0])
      assert(dialog.state.unit === '')
      assert(dialog.state.description === '')
      assert(dialog.state.decimalPlaces === 0)
      assert(dialog.state.isUpdating === false)
      assert(dialog.state.message === '')
    })
  })

  describe('componentDidMount', () => {
    it('should mount dialog', () => {
      let dialogDOM
      sinon.stub(dialogUtil, 'mountDialog', param => {
        dialogDOM = param
      })

      const props = generateProps()
      const store = buildEmptyStore({})
      mount(<Provider store={store}><MetricDialog {...props} /></Provider>)
      assert(dialogDOM !== undefined)

      dialogUtil.mountDialog.restore()
    })
  })

  describe('handleHideDialog', () => {
    it('should unmount dialog', () => {
      let dialogDOM
      sinon.stub(dialogUtil, 'mountDialog', () => {})
      sinon.stub(dialogUtil, 'unmountDialog', param => {
        dialogDOM = param
      })

      const props = generateProps()
      const store = buildEmptyStore({})
      const dialog = mount(<Provider store={store}><MetricDialog {...props} /></Provider>)
      const cancel = dialog.find(Button).last()
      cancel.simulate('click')

      assert(dialogDOM !== undefined)

      dialogUtil.mountDialog.restore()
      dialogUtil.unmountDialog.restore()
    })
  })

  describe('render', () => {
    it('should call postMetric action if the add button is clicked', () => {
      sinon.stub(dialogUtil, 'mountDialog', () => {})
      const props = generateProps()
      const dialog = shallow(<MetricDialog {...props} />)

      const add = dialog.find(Button).first()
      add.simulate('click')
      assert(props.postMetric.calledOnce)

      dialogUtil.mountDialog.restore()
    })

    it('should call updateMetric action if the edit button is clicked', () => {
      sinon.stub(dialogUtil, 'mountDialog', () => {})
      const props = generateProps()
      props.dialogType = dialogType.edit
      const dialog = shallow(<MetricDialog {...props} />)

      const add = dialog.find(Button).first()
      add.simulate('click')
      assert(props.updateMetric.calledOnce)

      dialogUtil.mountDialog.restore()
    })

    it('should close dialog when the update is successful', () => {
      let dialogDOM
      sinon.stub(dialogUtil, 'mountDialog', () => {})
      sinon.stub(dialogUtil, 'unmountDialog', param => {
        dialogDOM = param
      })

      const props = generateProps()
      props.postMetric = (t, p, ti, s, u, d, de, callbacks) => { callbacks.onSuccess() }
      const dialog = shallow(<MetricDialog {...props} />)

      const add = dialog.find(Button).first()
      add.simulate('click')
      assert(dialogDOM !== undefined)

      dialogUtil.mountDialog.restore()
      dialogUtil.unmountDialog.restore()
    })

    it('should hide advanced options at first', () => {
      sinon.stub(dialogUtil, 'mountDialog', () => {})
      const props = generateProps()
      const dialog = shallow(<MetricDialog {...props} />)

      assert(dialog.find(TextField).find({label: 'Unit'}).length === 0)
      dialogUtil.mountDialog.restore()
    })

    it('should show advanced options if clicked', () => {
      sinon.stub(dialogUtil, 'mountDialog', () => {})
      const props = generateProps()
      const dialog = shallow(<MetricDialog {...props} />)
      dialog.find(`div.${classes.advanced}`).simulate('click')

      assert(dialog.find(TextField).find({label: 'Unit'}).length === 1)
      dialogUtil.mountDialog.restore()
    })

    it('should throw the error if the metric type is unknown', () => {
      const props = generateProps()
      props.metric.type = 'Unknown'
      try {
        mount(<MetricDialog {...props} />)
        assert(false)
      } catch (e) {
        assert(e.message.match(/Unknown/))
      }
    })
  })
})
