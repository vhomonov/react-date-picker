'use strict';

var React = require('react')

var P = React.PropTypes

module.exports = React.createClass({

	displayName: 'DatePickerHeader',

	propTypes: {
		onChange: P.func,
		onPrev  : P.func,
		onNext  : P.func,
		colspan : P.number,
		children: P.node
	},

	render: function() {

		var props = this.props

		return <div className="dp-header">
            <table className="dp-nav-table">
            	<tbody>
	                <tr className="dp-row">
	                    <td 
	                    	className="dp-prev-nav dp-nav-cell dp-cell"
	                    	onClick={props.onPrev}
	                    >{props.prevText}
	                    </td>

	                    <td
	                    	className="dp-nav-view dp-cell"
	                    	colSpan={props.colspan}
	                    	onClick={props.onChange}
	                    >{props.children}</td>

	                    <td
	                    	className="dp-next-nav dp-nav-cell dp-cell"
	                    	onClick={props.onNext}
	                    >{props.nextText}</td>
	                </tr>
            	</tbody>
            </table>
        </div>
	}

})