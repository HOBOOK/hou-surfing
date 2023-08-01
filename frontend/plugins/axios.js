
export default function({ store, $axios, redirect, app, error}) {
    let trycount = 0

    $axios.onRequest((config) => {
        //console.log("Making request to " + config.url); // 요청 때마다 url 출력
    });

    $axios.onError( async (error) => {
        const refreshToken = app.$auth.$storage.getUniversal('_refresh_token.local')
        
        let response = null

        let refresh = async () => {
            if(refreshToken) {
                if(trycount > 3) {
                    trycount = 0
                    return Promise.resolve(response)
                }
                trycount++
                let isRefresh = false
                await $axios.post('/auth/refresh', {
                    refresh_token: refreshToken
                })
                .then(res=>{
                    if(res.data) {
                        app.$auth.$storage.setUniversal('_token.local', 'Bearer ' + res.data.token)
                        $axios.setToken(res.data.token, 'Bearer')
                        error.config.headers['Authorization'] = 'Bearer ' + res.data.token
                        isRefresh = true
                    } 
                    //redirect(location.href)
                }).catch(err=>{
                    store.commit('logout')
                    app.$auth.logout();
                    redirect('/login')
                    console.log(err)
                })
                
                if(isRefresh) {
                    await $axios.request(error.config)
                    .then(res=>{
                        trycount = 0
                        response = res
                    })
                }
            } else {
                store.commit('logout')
                app.$auth.logout();
                redirect('/login')
            }
        }

        const code = parseInt(error.response && error.response.status);
        if (code === 401) {
            await refresh()
        } else {
            //TODO 왜 에러코드를 확인할 수 없는지 확인 해야함
            let networkError = error.toString().indexOf('Network Error') !== -1
            if(networkError) {
                await refresh()
            }
        }
        if(response) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(error);
        }
    });

    
  }
   