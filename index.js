/*
  Converts a Gregorian date to Nepali.
*/
function toNepali(gy, gm, gd) {
  if (Object.prototype.toString.call(gy) === '[object Date]') {
    gd = gy.getDate()
    gm = gy.getMonth() + 1
    gy = gy.getFullYear()
  }
  return d2n(g2d(gy, gm, gd))
}

/*
  Converts a Nepali date to Gregorian.
*/
function toGregorian(ny, nm, nd) {
  return d2g(n2d(ny, nm, nd))
}

/*
  Checks whether a Nepali date is valid or not.
*/
function isValidNepaliDate(ny, nm, nd) {
  return  ny >= 2000 && ny <= 2099 &&
          nm >= 1 && nm <= 12 &&
          nd >= 1 && nd <= nepaliMonthLength(ny, nm)
}

/*
  Is this a leap year or not?
*/
function isLeapNepaliYear(ny) {
  return (nepaliCalendarData.leapYears.indexOf(ny)!=-1);
}

/*
  Number of days in a given month in a Nepali year.
*/
function nepaliMonthLength(ny, nm) {
  return nepaliCalendarData[ny][nm-1];
}

/*
  Converts a date of the Nepali calendar to the Julian Day number.

  @param ny Nepali year (1 to 3100)
  @param nm Nepali month (1 to 12)
  @param nd Nepali day (1 to 29/31)
  @return Julian Day number
*/
function n2d(ny, nm, nd) {
  let i=nepaliCalendarData.startYear;
  let d=nepaliCalendarData.startJulianDay-1;
  let ly=nepaliCalendarData.leapYears[0];
  for(let j=1;j<nepaliCalendarData.leapYears.length;j++){
    if(ly>ny) break;
    d+=(ly-i)*365;
    d+=366;
    i=ly+1;
    ly=nepaliCalendarData.leapYears[j]
  }
  if(ny-i > 1) d+=(ny-i)*365;
  for(i=1;i<nm;i++){
    d+=nepaliCalendarData[ny][i-1];
  }
  d+=nd;
  return d;
}
/*
  Converts the Julian Day number to a date in the Nepali calendar.

  @param jdn Julian Day number
  @return
    ny: Nepali year (1 to 3100)
    nm: Nepali month (1 to 12)
    nd: Nepali day (1 to 29/32)
*/
function d2n(jdn) {
  jdn=jdn-nepaliCalendarData.startJulianDay-1+2;
  let ny=nepaliCalendarData.startYear;
  let td=jdn;
  let d=td;
  try{
    for(let i=0;i<nepaliCalendarData.leapYears.length;i++){
      td-= (nepaliCalendarData.leapYears[i]-ny)*365;
      td-= 366;
      if(td<0) break;
      d=td;
      ny = nepaliCalendarData.leapYears[i]+1;
    }
    while(d > 365){
      d-=365;
      ny++;
    }
    let nm;
    for(nm=1;nm<12;nm++){
      if(d>nepaliCalendarData[ny][nm-1])
        d-=nepaliCalendarData[ny][nm-1];
      else
        break;
    }
    let nd=d;

    return  { ny: ny
            , nm: nm
            , nd: nd
            }
  }
  catch(exception){
    return null;
  }
}
/*
  Calculates the Julian Day number from Gregorian or Julian
  calendar dates. This integer number corresponds to the noon of
  the date (i.e. 12 hours of Universal Time).
  The procedure was tested to be good since 1 March, -100100 (of both
  calendars) up to a few million years into the future.

  @param gy Calendar year (years BC numbered 0, -1, -2, ...)
  @param gm Calendar month (1 to 12)
  @param gd Calendar day of the month (1 to 28/29/30/31)
  @return Julian Day number
*/
function g2d(gy, gm, gd) {
  var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
      + div(153 * mod(gm + 9, 12) + 2, 5)
      + gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d;
}

/*
  Calculates Gregorian and Julian calendar dates from the Julian Day number
  (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
  calendars) to some millions years ahead of the present.

  @param jdn Julian Day number
  @return
    gy: Calendar year (years BC numbered 0, -1, -2, ...)
    gm: Calendar month (1 to 12)
    gd: Calendar day of the month M (1 to 28/29/30/31)
*/
function d2g(jdn) {
  var j
    , i
    , gd
    , gm
    , gy
  j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  i = div(mod(j, 1461), 4) * 5 + 308
  gd = div(mod(i, 153), 5) + 1
  gm = mod(div(i, 153), 12) + 1
  gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return  { gy: gy
          , gm: gm
          , gd: gd
          }
}

/*
  Utility helper functions.
*/

function div(a, b) {
  return ~~(a / b)
}

function mod(a, b) {
  return a - ~~(a / b) * b
}

/*
  Nepali Calendar Data
*/
var nepaliCalendarData = {
    "2000" :  [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2001" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2002" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2003" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2004" :  [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2005" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2006" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2007" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2008" :  [ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31 ],
    "2009" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2010" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2011" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2012" :  [ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
    "2013" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2014" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2015" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2016" :  [ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
    "2017" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2018" :  [ 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2019" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2020" :  [ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2021" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2022" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ],
    "2023" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2024" :  [ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2025" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2026" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2027" :  [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2028" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2029" :  [ 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30 ],
    "2030" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2031" :  [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2032" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2033" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2034" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2035" :  [ 30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31 ],
    "2036" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2037" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2038" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2039" :  [ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
    "2040" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2041" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2042" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2043" :  [ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
    "2044" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2045" :  [ 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2046" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2047" :  [ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2048" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2049" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ],
    "2050" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2051" :  [ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2052" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2053" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ],
    "2054" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2055" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2056" :  [ 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30 ],
    "2057" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2058" :  [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2059" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2060" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2061" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2062" :  [ 30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31 ],
    "2063" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2064" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2065" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2066" :  [ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31 ],
    "2067" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2068" :  [ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2069" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2070" :  [ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
    "2071" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2072" :  [ 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
    "2073" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
    "2074" :  [ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2075" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2076" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ],
    "2077" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
    "2078" :  [ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2079" :  [ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
    "2080" :  [ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ],
    "2081" :  [ 31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
    "2082" :  [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
    "2083" :  [ 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30 ],
    "2084" :  [ 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30 ],
    "2085" :  [ 31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30 ],
    "2086" :  [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
    "2087" :  [ 31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30 ],
    "2088" :  [ 30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30 ],
    "2089" :  [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
    "2090" :  [ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
    "leapYears" : [2003, 2007, 2011, 2015, 2019, 2023, 2026, 2030, 2034, 2038, 2042, 2046, 2050, 2054, 2057, 2061, 2065, 2069, 2073, 2077, 2081, 2085, 2087],
    "startYear": 2000,
    "endYear":2090,
    "startJulianDay": 2430829
}

/*
  Expose functions.
*/
module.exports =
  { toNepali: toNepali
  , toGregorian: toGregorian
  , isValidNepaliDate: isValidNepaliDate
  , isLeapNepaliYear: isLeapNepaliYear
  , nepaliMonthLength: nepaliMonthLength
  , nepaliCalendarData: nepaliCalendarData
  , n2d: n2d
  , d2n: d2n
  , g2d: g2d
  , d2g: d2g
  }
