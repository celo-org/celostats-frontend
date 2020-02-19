export type color = 'info' | 'ok' | 'warn1' | 'warn2' | 'warn3' | 'warn4' | 'no' | undefined

export function colorRange(value: number, ranges: (number | null)[] = []): color {
  const colors = ['info', 'ok', 'warn1', 'warn2', 'warn3', 'warn4', 'no'] as any
  const index = ranges
    .findIndex(_ => (_ || _ === 0) && value <= _)
  return colors[index !== -1 ? index : ranges.length]
}

export function formatNumber(n: number, decimals: number = 2) {
  if (isNaN(+n)) {
    return 'n/a'
  }
  let [natural, decimal] = ((+n).toFixed(decimals) + '.').split('.')
  natural = natural.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  decimal = decimal.replace(/0+$/, '')
  return natural + (decimal ? '.' + decimal : '')
}


export function timeAgo(time: number, useMs: boolean = false, msLimit: number = 1000) {
  if (time === null || time === undefined) {
    return null
  }
  time = +time
  if (useMs) {
    if (time < msLimit) {
      return `${Math.floor(time)} ms`
    }
    time /= 1000
  }
  if (time < 60) {
    return `${Math.floor(time)} s`
  }
  if (time < (60 * 60)) {
    return `${Math.floor(time / 60)} m`
  }
  return `${Math.floor(time / 60 / 60)} h`
}
