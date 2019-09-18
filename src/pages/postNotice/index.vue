<template>
<div class="poseNotice">
    <i-panel title="发布通知">
    <!-- <i-input value="{{ value1 }}" title="收货人" autofocus placeholder="名字" />
    <i-input value="{{ value2 }}" type="number" title="联系电话" placeholder="请输入手机号" />
    <i-input value="{{ value3 }}" type="textarea" title="详细地址" placeholder="请输入详细地址(最多50字)" maxlength="50" />
    <i-input value="{{ value4 }}" title="用户信息" disabled /> -->
    </i-panel>
</div>
</template>

<script>
// Use Vuex
import store from './store'

export default {
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: {
    increment () {
      store.commit('increment')
    },
    decrement () {
      store.commit('decrement')
    }
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
