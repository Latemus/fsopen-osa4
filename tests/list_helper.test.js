const listHelper = require('../utils/list_helper')

const listOfBlogs = [
   { likes: 1, author: 'A' },
   { likes: 2, author: 'A' },
   { likes: 11, author: 'B' },
   { likes: 0, author: 'C' },
   { likes: null, author: 'C' },
   { author: 'C' },
   {}
]

describe('sum of likes', () => {
   test('empty array', () => {
      expect(listHelper.totalLikes([])).toBe(0)
   })
   test('array of blogs array', () => {
      expect(listHelper.totalLikes(listOfBlogs)).toBe(14)
   })
})

describe('most liked blog', () => {
   test('empty array', () => {
      expect(listHelper.favoriteBlog([])).toBe(null)
   })
   test('array of blogs array', () => {
      expect(listHelper.favoriteBlog(listOfBlogs)).toEqual({ author: 'B', likes: 11 })
   })
})

describe('most liked author', () => {
   test('empty array', () => {
      expect(listHelper.mostLikes([])).toBe(null)
   })
   test('array of blogs array', () => {
      expect(listHelper.mostLikes(listOfBlogs)).toEqual({ author: 'B', likes: 11 })
   })
})

describe('with most blogs', () => {
   test('empty array', () => {
      expect(listHelper.mostBlogs([])).toBe(null)
   })
   test('array of blogs array', () => {
      expect(listHelper.mostBlogs(listOfBlogs)).toEqual({ author: 'C', blogs: 3 })
   })
})

