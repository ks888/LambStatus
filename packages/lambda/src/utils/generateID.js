const allowedChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default (length) => {
  let id = ''
  for (let i = 0; i < length; i++) {
    id += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length))
  }
  return id
}
