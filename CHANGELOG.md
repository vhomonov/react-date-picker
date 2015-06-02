react-date-picker
=================
#### v2.1.0

 * remove normalize.css dependency
 * remove 'sans-serif'  font-family from css - font will be inherited from parent node
 
#### v2.0.12

 * add CI integration - see https://circleci.com/gh/zippyui/react-date-picker

#### v2.0.0

 * `onChange`, `onSelect`, `onNav` are called with date string first, and then the moment instance. So the first 2 args are inverted from previous versions
 * add support for better i18n - through `locale`, `weekStartDay` and `weekDayNames` props
 * made `viewDate` and `view` controlled. Introduced uncontrolled alternatives `defaultViewDate`(default to `date` or now) and `defaultView` (defaults to `"month"`)
 * add `onViewDateChange` and `onViewChange` props that can be used to handle the changes for the respective properties
 * add `navOnDateClick` - defaults to true. If false, will not navigate to the date that was clicked, even if that date is in the prev/next month
 * add `dayFormat`, `monthFormat`, `yearFormat`

Starting v 2.0.0 `react-date-picker` is moved to [zippyui](http://github.com/zippyui).

#### v1.4.0

 * `today` and `gotoSelected` are renamed as `todayText` and `gotoSelectedText`. Old names are now deprecated, and will be removed in a future minor version.
 * add `renderFooter` prop, which can be used to render a different footer.
 * change the behavior of `renderDay` prop: if it now returns undefined, we assume it just changed props, so we render the default cell, with the updated props. This means you can use `renderDay` both to affect the props object passed to day cells and/or the render a completely different cell

#### v1.3.0
 * `renderDay` & `onRenderDay` properties are available to allow full control over day-cell rendering
 * `onNav` is called with new args: moment, text, view, direction - where moment is a date as a momentjs instance, text is the date formatted as text, the view is the view name ('month','year','decade') and direction is 1 (nav to next period) or -1 (nav to prev period)
 * `onSelect` is called with new args: moment, text, view
