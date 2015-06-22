'use strict';

var React = require('react')

var P = React.PropTypes

var onEnter = require('./onEnter')

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
	                    	tabIndex="1"
	                      role="link"
	                    	className="dp-prev-nav dp-nav-cell dp-cell"
	                    	onClick={props.onPrev}
	                    	onKeyUp={onEnter(props.onPrev)}
	                    >{props.prevText}
	                    </td>

	                    <td
	                    	tabIndex="1"
	                        role="link"
	                    	className="dp-nav-view dp-cell"
	                    	colSpan={props.colspan}
	                    	onClick={props.onChange}
	                    	onKeyUp={onEnter(props.onChange)}
	                    >{props.children}</td>

	                    <td
	                    	tabIndex="1"
	                      role="link"
	                    	className="dp-next-nav dp-nav-cell dp-cell"
	                    	onClick={props.onNext}
	                    	onKeyUp={onEnter(props.onNext)}
	                    >{props.nextText}</td>
	                </tr>
            	</tbody>
            </table>
        </div>
	}

})
