import React, { PropTypes } from 'react'
import classes from './Scripts.scss'

const pythonScript = `
"""Script to submit data points via LambStatus API.

It generates and submits random 24 * 60 data points.
"""

import httplib
import datetime
import time
import random
import json

# The following 3 are the actual values that pertain to your stack and this specific metric
api_key = '<API_KEY>'
hostname = '<API_HOSTNAME>'
metric_id = '<METRIC_ID>'

# Generate random data points for the whole day.
total_points = 60 * 24
curr = datetime.datetime.utcnow()
datapoints = []
for i in range(total_points):
  timestamp = curr.isoformat()
  value = random.randint(0, 99)
  datapoints.append({'timestamp': timestamp, 'value': value})

  curr -= datetime.timedelta(minutes=1)

# Submit the data points
body = json.dumps({metric_id: datapoints})
headers = {'Content-Type': 'application/json', 'x-api-key': api_key}
conn = httplib.HTTPSConnection(hostname)
conn.request('POST', '/prod/v0/metrics/data', body, headers)
resp = conn.getresponse()
if resp.status == 200:
    print 'Successfully submitted', str(total_points), 'datapoints'
else:
    print 'Failed to submit the datapoints:', resp.status, resp.reason
    body = resp.read()
    print body
`

export default class Scripts extends React.Component {
  static propTypes = {
    params: PropTypes.shape({
      metricid: PropTypes.string.isRequired,
      lang: PropTypes.string.isRequired
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        apiKey: PropTypes.string,
        hostname: PropTypes.string
      }).isRequired
    }).isRequired
  }

  render () {
    const lang = this.props.params.lang
    let script
    if (lang === 'python') {
      script = pythonScript
    } else {
      script = `Unsupported language: ${lang}`
    }

    const metricID = this.props.params.metricid
    script = script.replace('<METRIC_ID>', metricID)

    const query = this.props.location.query
    if (query.hasOwnProperty('apiKey')) {
      script = script.replace('<API_KEY>', query['apiKey'])
    }
    if (query.hasOwnProperty('hostname')) {
      script = script.replace('<API_HOSTNAME>', query['hostname'])
    }

    return (
      <pre className={classes.script}>
        <code>
          {script}
        </code>
      </pre>
    )
  }
}
