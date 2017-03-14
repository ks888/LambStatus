#!/usr/bin/env python

import sys
import datetime
import random

def gen(min_value, max_value):
    curr = datetime.datetime.now()
    value = random.randint(min_value, max_value)
    num_entry = 60 * 24 * 30 / 5  # 30 days, by 5 mins
    print '['
    for i in xrange(num_entry):
        suffix = ','
        if i + 1 == num_entry:
            suffix = ''
        timestamp = curr
        value = value + random.randint(-5, 5)
        print ' {"timestamp":"' + curr.isoformat()[:-3] + 'Z","value":' + str(value) + '}' + suffix
        curr += datetime.timedelta(minutes=5)
    print ']'

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print 'Usage: ' + sys.argv[0] + ' [min_value] [max_value]'
        sys.exit(1)

    min_value = int(sys.argv[1])
    max_value = int(sys.argv[2])
    gen(min_value, max_value)
