<template>
  <div class="index-container">

    <div class="title">
      系统公告
    </div>
    
    <div class="content">
      暂无内容暂无内容暂无内容暂无内容暂无内容暂无内容
    </div>


  </div>
</template>

<script>
export default {
  name: "Index",
};
</script>

<style lang="scss" scoped>
.index-container {
  height: 100%;
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  position: relative;

  .title{
    color: #666;
    font-size: 26px;
    font-weight: bold;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;

    .card-panel-description {
      float: left;
      font-weight: bold;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 24px;
        margin-bottom: 12px;
      }
    }

    .content{
      margin-top: 20px;
    }
  }
}
</style>