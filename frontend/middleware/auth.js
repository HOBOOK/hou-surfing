
export default function ({ route, app, redirect }) {

  // const loginURI = '/login'

  // // auth 확인
  // const token = app.$auth.$storage.getUniversal('_token.local')
  // if (token && token === 'Bearer undefined'){
  //   app.$auth.$storage.setUniversal('_token.local', false)
  // }
  // if (!token){
  //   app.$auth.logout()
  // }


  // let redirect_params = ''
  // if(route.query) {
  //   redirect_params += '?'
  //   for(let k in route.query) {
  //     redirect_params += k + '=' + route.query[k]
  //     redirect_params += '&'
  //   }
  //   redirect_params = redirect_params.substring(0, redirect_params.length - 1)
  // }

  // if (!route.path.includes(loginURI)) {
  //   if (!token){
  //     return redirect('/login');
  //   }
  //   else
  //     return redirect(route.path + redirect_params);
  // } else {
  //   return redirect(route.path + redirect_params); 
  // }
}


