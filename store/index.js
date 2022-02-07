import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          (post) => post.id === editedPost.id
        )
        state.loadedPosts[postIndex] = editedPost
      },
      setToken(state, token) {
        state.token = token
        console.log("statetoken")
        console.log(state.token)
        console.log("statetoken end")
      },
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return this.$axios
          .$get(
            'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts.json'
          )
          .then((res) => {
            console.log(res)
            const postArray = []
            for (const key in res) {
              postArray.push({ ...res[key], id: key })
            }
            vuexContext.commit('setPosts', postArray)
            console.log('postArray commited')
            console.log(postArray)
          })
          .catch((e) => context.error(e))
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date(),
        }
        return this.$axios
          .$post(
            'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts.json',
            createdPost
          )
          .then((result) => {
            console.log('result:')
            console.log(result)
            vuexContext.commit('addPost', { ...createdPost, id: result.name })
          })
          .catch((e) => console.log(e))
      },
      editPost({ commit }, editedPost) {
        return this.$axios
          .$put(
            'https://nuxt-first-kimi-default-rtdb.firebaseio.com/posts/' +
              editedPost.id +
              '.json',
            editedPost
          )
          .then((res) => {
            console.log(res)
            commit('editPost', editedPost)
          })
          .catch((e) => console.log(e))
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      },
      authenticateUser({ commit }, authData) {
        let authUrl =
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          process.env.fbAPIKey
        if (!authData.isLogin) {
          authUrl =
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
            process.env.fbAPIKey
        }
        return this.$axios
          .$post(authUrl, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          })
          .then((result) => {
            console.log(result)
            commit('setToken', result.idToken)
            console.log(result.idToken)
          })
          .catch((e) => console.log(e))
      },
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts
      },
    },
  })
}

export default createStore
