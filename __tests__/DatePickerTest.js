'use strict';

jest.dontMock('../lib')

describe('DatePicker', function(){
	it('renders selected date', function(){

		var React      = require('react/addons')
		var TestUtils  = React.addons.TestUtils
		var DatePicker = React.createFactory(require('../lib'))

		var picker = TestUtils.renderIntoDocument(
			React.DOM.input({value: 'test'})
		)

		// var dateCell = TestUtils.findRenderedDOMComponentWithClass('dp-value')

		// expect(dateCell.getDOMNode().textContent).toEqual('32')

	})
})