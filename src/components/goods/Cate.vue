<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag
            type="warning"
            size="mini"
            v-else-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="showDelCateDialog(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="70px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="delCateDialogVisible"
      width="50%"
      @close="delCateDialogClosed"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="delCateDialogClosed">取 消</el-button>
        <el-button type="primary" @click="delCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //控制各类对话框的显示隐藏
      addCateDialogVisible: false, //添加分类
      editCateDialogVisible: false, //编辑分类
      delCateDialogVisible: false, //删除分类

      querInfo: {
        typt: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据列表
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template', //表示当前列定义为模板列
          template: 'isok', //表示当前这一列使用模板名称
        },
        {
          label: '排序',
          type: 'template', //表示当前列定义为模板列
          template: 'order', //表示当前这一列使用模板名称
        },
        {
          label: '操作',
          type: 'template', //表示当前列定义为模板列
          template: 'opt', //表示当前这一列使用模板名称
        },
      ],
      //添加分类的表单数据对象
      addCateForm: {
        cat_name: '', //将要添加的分类的名称
        cat_pid: 0, //父级分类的id
        cat_level: 0, //分类的等级，默认添加的是一级分类
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      editCateForm: {
        cat_name: '',
      },
      editCateFormRules: {},
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //选中的父级分类的ID数组
      selectedKeys: [],
      //编辑和删除时用到的id
      editdelID: 0,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    /**********点击按钮，展示各类对话框***********/
    showAddCateDialog() {
      this.getParentCateList() //获取父级分类信息列表
      this.addCateDialogVisible = true
    }, //添加分类
    showEditCateDialog(editId) {
      this.editCateDialogVisible = true
      this.editdelID = editId
    }, //编辑分类
    showDelCateDialog(delId) {
      this.delCateDialogVisible = true
      this.editdelID = delId
    }, //删除分类

    /**********点击按钮，关闭各类对话框***********/
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }, //监听对话框的关闭事件，重置表单数据
    editCateDialogClosed() {
      this.editCateDialogVisible = false
      this.editCateForm.cat_name = ''
      this.editdelID = 0
    }, //关闭编辑对话框
    delCateDialogClosed() {
      this.delCateDialogVisible = false
      this.editdelID = 0
    }, //关闭删除对话框

    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      //把数据列表赋值给catelist,为总数据条数赋值
      this.catelist = res.data.result
      this.total = res.data.total
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    //选择项发生变化时触发该函数
    parentCateChanged() {
      // console.log(this.selectedKeys)
      //判断要添加到哪个分类下面
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]

        //为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0 //父分类id
        this.addCateForm.cat_level = 0 //为当前分类等级赋值
      }
    },

    //点击按钮添加新的分类
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //编辑分类信息
    editCate() {
      // console.log(this.editCateForm)
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'categories/' + this.editdelID,
          this.editCateForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败')
        }
        this.$message.success('编辑分类成功')
        this.getCateList()
        this.editdelID = 0
        this.editCateDialogVisible = false
      })
    },
    //删除分类信息
    async delCate() {
      const { data: res } = await this.$http.delete('categories/' + this.editdelID)
      if(res.meta.status !== 200){
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getCateList()
      this.editdelID = 0
      this.delCateDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
