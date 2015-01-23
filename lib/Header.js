'use strict';

var React = require('react')

module.exports = React.createClass({

	displayName: 'DatePickerHeader',

	render: function() {

		var props = this.props

		return React.createElement("div", {className: "dp-header"}, 
            React.createElement("table", {className: "dp-nav-table"}, 
            	React.createElement("tbody", null, 
	                React.createElement("tr", {className: "dp-row"}, 
	                    React.createElement("td", {
	                    	className: "dp-prev-nav dp-nav-cell dp-cell", 
	                    	onClick: props.onPrev
	                    }, props.prevText
	                    ), 

	                    React.createElement("td", {
	                    	className: "dp-nav-view dp-cell", 
	                    	colSpan: props.colspan, 
	                    	onClick: props.onChange
	                    }, props.children), 

	                    React.createElement("td", {
	                    	className: "dp-next-nav dp-nav-cell dp-cell", 
	                    	onClick: props.onNext
	                    }, props.nextText)
	                )
            	)
            )
        )
	}

})