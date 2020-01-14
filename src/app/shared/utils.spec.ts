import { formatNumber, colorRange } from './utils'

describe('Util', () => {
  describe('formatNumber', () => {
    it('should show `n` number of decimals', () => {
      expect(formatNumber(0.1234567)).toBe('0.12')
      expect(formatNumber(0.1234567, 3)).toBe('0.123')
      expect(formatNumber(0.1234567, 0)).toBe('0')
    })

    it('should add comma separators to number', () => {
      expect(formatNumber(1987654321.123)).toBe('1,987,654,321.12')
      expect(formatNumber(987654321.123)).toBe('987,654,321.12')
      expect(formatNumber(54321.123)).toBe('54,321.12')
      expect(formatNumber(321.123)).toBe('321.12')
      expect(formatNumber(21.123)).toBe('21.12')
      expect(formatNumber(1.123)).toBe('1.12')
    })
  })

  describe('colorRange', () => {
    it('should return a color code depending on the position of a range', () => {
      const range = [0, 1, 2, 3, 4, 5]

      expect(colorRange(0, range)).toBe('info')
      expect(colorRange(1, range)).toBe('ok')
      expect(colorRange(2, range)).toBe('warn1')
      expect(colorRange(3, range)).toBe('warn2')
      expect(colorRange(4, range)).toBe('warn3')
      expect(colorRange(5, range)).toBe('warn4')
      expect(colorRange(6, range)).toBe('no')
    })

    it('should return a color code depending on the position of a range ignoring nulls', () => {
      const range = [0, 1, 2, , 4, 5]

      expect(colorRange(0, range)).toBe('info')
      expect(colorRange(1, range)).toBe('ok')
      expect(colorRange(2, range)).toBe('warn1')
      expect(colorRange(3, range)).toBe('warn3')
      expect(colorRange(4, range)).toBe('warn3')
      expect(colorRange(5, range)).toBe('warn4')
      expect(colorRange(6, range)).toBe('no')
    })

    it('should return the last color code if the number is larger than last range', () => {
      expect(colorRange(Infinity, new Array(0))).toBe('info')
      expect(colorRange(Infinity, new Array(1))).toBe('ok')
      expect(colorRange(Infinity, new Array(2))).toBe('warn1')
      expect(colorRange(Infinity, new Array(3))).toBe('warn2')
      expect(colorRange(Infinity, new Array(4))).toBe('warn3')
      expect(colorRange(Infinity, new Array(5))).toBe('warn4')
      expect(colorRange(Infinity, new Array(6))).toBe('no')
    })
  })
})
