import React from 'react'
import { Provider } from 'react-redux'
import { mount, shallow } from 'enzyme'
import { monitoringServices, metricStatuses } from 'utils/status'
import * as dialogUtil from 'utils/dialog'
import Button from 'components/common/Button'
import CloudWatchMetricsSelector from 'components/adminPage/CloudWatchMetricsSelector'
import MetricDialog, { dialogType } from 'components/adminPage/MetricDialog/MetricDialog'
import classes from 'components/adminPage/MetricDialog/MetricDialog.scss'

describe('MetricDialog', () => {
  const generateProps = () => {
    return {
      onClosed: sinon.spy(),
      metricID: '1',
      metric: {
        metricID: '1',
        type: '',
        props: {},
        title: 'Title',
        status: metricStatuses[0],
        unit: 'ms',
        description: 'description',
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
      assert(dialog.state.isUpdating === false)
      assert(dialog.state.message === '')
    })

    it('should set default value if the metric is empty', () => {
      const dialog = new MetricDialog({})
      assert(dialog.state.type === monitoringServices[0])
      assert(dialog.state.props === null)
      assert(dialog.state.title === '')
      assert(dialog.state.status === metricStatuses[0])
      assert(dialog.state.unit === '')
      assert(dialog.state.description === '')
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
    it('should show cloud watch metrics selector by default', () => {
      sinon.stub(dialogUtil, 'mountDialog', () => {})
      const props = generateProps()
      props.metric = undefined
      const dialog = shallow(<MetricDialog {...props} />)

      const selector = dialog.find(CloudWatchMetricsSelector)
      assert(selector.length === 1)

      dialogUtil.mountDialog.restore()
    })

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
  })
})
