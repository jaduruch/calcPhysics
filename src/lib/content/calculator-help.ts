export const calculatorHelp = {
 title:'Calculator guide',
 description:'Enter known values, calculate with expressions and prefixes, and choose units directly beside each field.',
 steps:[
  'Enter known values and leave unknown quantities blank. Results update automatically.',
  'Use numbers or expressions with (), +, -, *, / and ^. Decimal points and commas both work. Example: (1 + 3) * 2 = 8.',
  'Add prefixes to individual numbers: k = 1000, m = 0.001, u or µ = 0.000001. Example: 1k + 1m = 1000.001. Prefixes are case-sensitive.',
  'Choose the unit beside the field. It applies to the whole expression. Changing the unit keeps the input text and interprets it in the new unit. Angles start in degrees; radians remain available.',
  'Results show three significant figures; calculations use unrounded values. The info button explains formulas and assumptions. Reset clears the calculator.'
 ]
} as const;

export const helpExamples=[
 {id:'motion',title:'Calculate an unknown quantity',hint:'For constant velocity, s is displacement from the starting point. Enter any two quantities; leave the third blank.'},
 {id:'expression',title:'Try an expression',hint:'Try (1 + 3) * 2, 2^3 or 1 / 0. Only valid finite results are accepted.'},
 {id:'prefix',title:'Try prefixes',hint:'Try 1k + 1m in meters. Here m inside the input is the milli prefix; the unit is selected separately.'},
 {id:'units',title:'Try changing units',hint:'Load 36 km/h and 90°. Then change a unit: the typed value stays unchanged and its interpretation changes.'},
 {id:'precision',title:'See display rounding',hint:'Try 1 / 3. The result shows three significant figures; the value before display rounding is shown separately. Reset clears this example.'}
] as const;
