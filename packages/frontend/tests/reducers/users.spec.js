import { getUser } from 'actions/users'
import userReducer from 'reducers/users'

describe('Reducers/users', () => {
  const user = {
    username: 'inami'
  }
  describe('getUserHandler', () => {
    it('Should update the `user` state.', () => {
      const state = userReducer(undefined, getUser(user))
      assert(user === state.user)
    })
  })
})
