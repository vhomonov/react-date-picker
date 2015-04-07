'use strict';

var should = require('should')
var React      = require('react/addons')
var TestUtils  = React.addons.TestUtils
var DatePicker = React.createFactory(require('../lib'))

var VALUE_CLASS = 'dp-value'

function render(node){
    return TestUtils.renderIntoDocument(node)
}

function findWithClass(root, cls){
    return TestUtils.findRenderedDOMComponentWithClass(root, cls)
}

function tryWithClass(root, cls){
    return TestUtils.scryRenderedDOMComponentsWithClass(root, cls)
}

describe('DatePicker', function(){

	it('renders selected date - also make sure no crash on null date', function(){

        require('./testdom')()

		var picker = render(
			DatePicker({
				date: '2014-04-03'
			})
		)

		var dateCell = findWithClass(picker, VALUE_CLASS)

		dateCell.getDOMNode()
            .textContent
            .should.equal('3')

        picker.setProps({
            date: '2014-04-20',
        })

        dateCell = findWithClass(picker, VALUE_CLASS)

        dateCell.getDOMNode()
            .textContent
            .should.equal('20')

        picker.setProps({
            date: null
        })

        tryWithClass(picker, VALUE_CLASS)
            .length
            .should
            .equal(0)

	})

    it('render defaultDate', function(){
        var picker = render(DatePicker({defaultDate: '2014-03-25'}))

        findWithClass(picker, VALUE_CLASS)
            .getDOMNode()
            .textContent
                .should
                .equal('25')
    })

})