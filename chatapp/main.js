import Vue from 'vue'
import App from './App'

//引入socket模塊
import io from './components/socket/weapp.socket.io.js'
Vue.config.productionTip = false
//伺服器ip
Vue.prototype.serverUrl = 'http://192.168.100.2:3002'
Vue.prototype.socket = io('http://192.168.100.2:8082')

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
