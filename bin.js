#!/usr/bin/env node

'use strict'

var LineIn = require('line-in')
var sonos = require('./sink/sonos')

sonos(new LineIn())
