<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAEDDialog('add')"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="setAddRoleDialog"
        width="50%"
        @close="setRoleInfoClosed('add')"
      >
        <el-form
          :model="roleInfo"
          :rules="roleInforules"
          ref="addroleInfo"
          label-width="70px"
        >
          <el-form-item label="名称" prop="roleName">
            <el-input v-model="roleInfo.roleName"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="roleDesc">
            <el-input v-model="roleInfo.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setAddRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="setRolesInfo('add')"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 角色列表区 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 三级权限-->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showAEDDialog('edit', scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="showAEDDialog('del', scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="setEditRoleDialog"
      width="50%"
      @close="setRoleInfoClosed('edit')"
    >
      <el-form
        :model="roleInfo"
        :rules="roleInforules"
        ref="editroleInfo"
        label-width="70px"
      >
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="roleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="roleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setEditRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRolesInfo('edit')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 删除角色对话框 -->
    <el-dialog title="提示" :visible.sync="setDelRoleDialog" width="50%">
      <span>确认删除信息？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDelRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRolesInfo('del')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightslist: [],
      //树形控件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      //默认选中的结点Id值数组
      defKeys: [],
      //当前即将分配权限的角色id
      roleId: '',
      //控制添加、编辑、删除角色对话框显示
      setAddRoleDialog: false,
      setEditRoleDialog: false,
      setDelRoleDialog: false,
      //添加、编辑角色用户信息及验证规则
      roleInfo: {
        roleName: '',
        roleDesc: '',
      },
      roleInforules: {
        roleName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
      //更改角色信息内容
      editroleInfo: {},
      //要删除元素的id
      delId: 1
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
    },

    //根据Id删除对应的权限
    async removeRightById(role, rightId) {
      //弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      role.children = res.data
    },

    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightslist = res.data
      //递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },

    //通过递归的形式，获取角色下所有三级权限的id
    getLeafKeys(node, arr) {
      //若当前node结点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },

    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },

    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    //展示各类弹出框
    async showAEDDialog(e, id) {
      if (e === 'add') this.setAddRoleDialog = true
      else if (e === 'edit') {
        const { data: res } = await this.$http.get('roles/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失败')
        }
        this.editroleInfo = res.data
        this.roleInfo.roleName = this.editroleInfo.roleName
        this.roleInfo.roleDesc = this.editroleInfo.roleDesc
        this.setEditRoleDialog = true
        // console.log(res.data.roleName)
      } else if (e === 'del') {
        this.setDelRoleDialog = true
        this.delId = id
        console.log(this.delId)
      }
    },
    //弹窗关闭
    setRoleInfoClosed(e) {
      if (e === 'add') this.$refs.addroleInfo.resetFields()
      else if (e === 'edit') this.$refs.editroleInfo.resetFields()
    },
    async setRolesInfo(e) {
      if (e === 'add') {
        this.$refs.addroleInfo.validate(async (valid) => {
          if (!valid) return
          //发起添加角色的网络请求
          const { data: res } = await this.$http.post('roles', this.roleInfo)
          if (res.meta.status !== 201) {
            this.$message.error('添加角色失败')
          }
          this.$message.success('添加角色成功')
          this.setAddRoleDialog = false
          this.getRolesList()
        })
      } else if (e === 'edit') {
        this.$refs.editroleInfo.validate(async (valid) => {
          if (!valid) return
          const { data: res } = await this.$http.put(
            'roles/' + this.editroleInfo.roleId,
            {
              roleName: this.roleInfo.roleName,
              roleDesc: this.roleInfo.roleDesc,
            }
          )
          if (res.meta.status !== 200) {
            this.$message.error('修改信息失败')
          }
          this.setEditRoleDialog = false
          this.getRolesList()
          return this.$message.success('修改信息成功')
        })
      } else if (e === 'del') {
        const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).catch((err) => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const { data: res } = await this.$http.delete('roles/' + this.delId)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message.success('删除用户成功')
        this.setDelRoleDialog = false
        this.getRolesList()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
