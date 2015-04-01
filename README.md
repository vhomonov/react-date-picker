react-date-picker
=================

> A carefully crafted date picker for React

See demo at [zippyui.github.io/react-date-picker](http://zippyui.github.io/react-date-picker)

<img src="http://npm.packagequality.com/badge/react-date-picker.png"/>

## Install

```sh
$ npm install react-date-picker
```

## Changelog

See [changelog](./CHANGELOG.md)

## Usage

### NOTES:

Don't forget to include index.css or index.styl! ( require('react-date-picker/index.css') )

If you use the files from the `dist` directory, (eg: `dist/react-date-picker.js`), you will need to make sure you have both `React` and `moment` global variables, so make sure you include [ReactJS](https://www.npmjs.com/package/react) and [MomentJS](https://www.npmjs.com/package/moment)

The preferred **React** version for `react-date-picker` is  >=0.12. The initial version of `react-date-picker` worked with React 0.11.2 as well, but I do not intend to continue to support it, in order to be able to focus on advancing the current features and developing other high-quality React components.

### Example

```jsx
var date = '2014-10-10' //or Date.now()

function onChange(dateString, moment){
    //...
}

<DatePicker
    minDate='2014-04-04'
    maxDate='2015-10-10'
    date={date}
    onChange={onChange}
/>
```

## I18n and localization

For rendering the date picker with a custom locale, there are two options

#### require locale

The first option is to simply require the appropriate momentjs locale before `require`-ing `react-date-picker`

Example:

```jsx
//make sure you require this first!
var nl = require('moment/locale/nl')

//and then require the date picker - it will use
//the locale you previously required

var DatePicker = require('react-date-picker')
```

#### locale prop

The second option is specifying the `locale` prop on the date picker. This assumes you have momentjs with the locale already into page (for example, you are using `moment-with-locales.js`)

```jsx
<DatePicker locale="fr" />
```


### Other i18n props

 * `weekDayNames` - either an array of week day names, or a function that returns an array. In case you specify `weekDayNames` as an array, it should have Sunday as the first day. If not specified, will be built with `momentjs`using `moment.weekdaysShort()`
 * `weekStartDay`: Number - Sun 0, Monday 1, etc... If not specified, the locale specific value will be used.
 * `locale`: String
 * todayText: String
 * gotoSelectedText: String

## Props

 * hideFooter: Boolean - by default footer is shown, so specify this to true if you don't want the footer
 * date    : Date / String / Moment / Number
 * `minDate` : Date / String / Moment / Number
 * `maxDate` : Date / String / Moment / Number
 * `dateFormat`: String [see moment.js formats](http://momentjs.com/docs/#/displaying/format/). Default date format is 'YYYY-MM-DD'
 * `onChange`: Function(dateText, moment, event) - called when the user selects a date

 * `onSelect`: Function(dateText, moment, view) - called when the user selects a year/month
 * `onNav`: Function(dateText, moment, view, direction) - called when the user navigates to the next/previous month/year/decade.
 * `renderDay`: Function - (optional) A function that should return a React DOM for the day cell. The first param is the props object. You can use this to have full control over what gets rendered for a day.
 * `onRenderDay`: Function - (optional) A function that can manipulate the props object for a day, and SHOULD return a new props object. Use this for custom day styling. You can use this to take full control over the styles/css classes/attributes applied to the day cell in the month view.

#### Formatting props

 * `dayFormat` - The format in which days should be rendered (on the MonthView)
 * `monthFormat` - The format in which months should be rendered (on the YearView)
 * `yearFormat` - The format in which years should be rendered (on the DecadeView)

#### Props related to the view (the current date in view and the type of view)
 * `defaultViewDate`: Date / String / Moment / Number - a date for the period to show in the picker. If none specified, defaults to `date` or to the current date.
 * `viewDate`: Date / String / Moment / Number - controlled version for `defaultViewDate`
 * `onViewDateChange`: Function(dateText, moment , view) - called when navigating to another viewDate.

 * `defaultView`: String - the view to render initially in the datepicker - if no defaultView is specified, the "month" view is rendered. Possible values: "month", "year", "decade".
 * `view`: String - controlled version for `defaultView`.
 * `onViewChange`: Function - function called when the view is changed. If using the controlled `view` version, make sure you update the `view` prop in this function if you want to navigate to another view as expected.

 * `navOnDateClick`: Boolean - defaults to true. If false, will not navigate to the date that was clicked, even if that date is in the prev/next month

## Examples


#### Custom styling of day cells

```jsx

function onRenderDay(props){
    if (props.date.isBefore('2010-01-01')){
        props.className += ' invalid'
    }

    props.style.border = '1px solid red'

    return props
}

<DatePicker
    onChange={this.onChange}
    onRenderDay={onRenderDay}
/>
```
## Contributing

When contributing, please work on the `src` dir.

You'll need to run the following commands:

```sh
$ npm run serve # starts a local http server
$ npm run dev # starts webpack-dev-server, which does all the bundling and live reloading
```

Now navigate to `http://localhost:8080/`.
With this setup, you have an environment which live-reloads all your changes, so you have a rapid development cycle.

In order to build a new production version, make sure you run `npm run build` (it builds the `lib` directory from the `src` directory, it concats all files and builds the `dist` directory, and also prepares the css files)

## Other

`react-date-picker` uses the awesome `moment.js` library ( Big thanks!)

If you don't use npm you can include any of the following:

 * `dist/react-date-picker.js` - the full sources. NOTE: You'll need to include `React` separately
 * `dist/react-date-picker.min.js` - minified & optimized version. NOTE: You'll need to include `React` separately
 * `dist/react-date-picker.nomoment.js` - the full sources. NOTE: You'll need to include `React` AND `moment.js` separately
 * `dist/react-date-picker.nomoment.min.js` - minified & optimized version. NOTE: You'll need to include `React` AND `moment.js` separately

## License

#### MIT