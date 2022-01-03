<template>
  <div class="components-container">
    <div class="head">
      <div class="title">编辑公告内容</div>
      <div class="btn">
        <el-button type="primary" @click="sendAnno"
          >发布<i class="el-icon-upload el-icon--right"></i
        ></el-button>
      </div>
    </div>
    <div>
      <tinymce v-model="content" :height="300" />
    </div>
    <div class="title">预览效果</div>
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
export default {
  name: "Announcement",
  components: { Tinymce },
  data() {
    return {
      content: ``,
    };
  },
  methods:{
    sendAnno(){
      
    }
  }
};
</script>

<style>
.editor-content {
  margin-top: 20px;
}

.title {
  margin: 20px 0;
  font-weight: bold;
  font-size: 24px;
  color: #363636;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>