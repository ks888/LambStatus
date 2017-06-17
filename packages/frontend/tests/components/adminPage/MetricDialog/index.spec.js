import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import * as dialogUtil from 'utils/dialog'
import { metricStatuses } from 'utils/status'
import MetricDialog, { metricDialogType } from 'components/adminPage/MetricDialog'
import RawMetricDialog from 'components/adminPage/MetricDialog/MetricDialog'

describe('MetricDialog', () => {
  const generateProps = () => {
    return {
      onClosed: sinon.spy(),
      metricID: '1',
      dialogType: metricDialogType.add,
      postMetric: sinon.spy(),
      updateMetric: sinon.spy()
    }
  }

  describe('mapStateToProps', () => {
    it('should set metric as props', () => {
      sinon.stub(dialogUtil, 'mountDialog', param => {})

      const props = generateProps()
      const metric = {
        metricID: props.metricID,
        type: '',
        props: {},
        title: 'Title',
        status: metricStatuses[0],
        unit: 'ms',
        description: 'description',
        order: 0
      }
      const store = buildEmptyStore({metrics: {metrics: [metric]}})
      const dialog = mount(<Provider store={store}><MetricDialog {...props} /></Provider>).find(RawMetricDialog)
      assert(dialog.props().metric.metricID === props.metricID)

      dialogUtil.mountDialog.restore()
    })
  })
})
