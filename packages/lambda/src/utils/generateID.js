const allowedChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const idLength = 12

export default (length = idLength) => {
  let id = ''
  for (let i = 0; i < length; i++) {
    id += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length))
  }
  return id
}
