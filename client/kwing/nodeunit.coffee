#!/usr/bin/env node
reporter = require('nodeunit').reporters.default
reporter.run(['test/test_vector.coffee', 'test/test_array.coffee'])
