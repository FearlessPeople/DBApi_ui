<template>
    <a-drawer :width="400" :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
        <template #header>
            <span>给【{{ roleData.name }}】角色分配权限</span>
        </template>
        <div>
            <!-- 树形组件，展示数据，支持复选框 -->
            <a-tree
                :blockNode="true"
                :expanded-keys="[0]"
                :show-line="true"
                :checkable="true"
                :block-node="true"
                v-model:checked-keys="checkedKeys"
                :data="treeData"
            />
        </div>
    </a-drawer>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue'
import { RoleRecord, allPermissions, setPermissions, getPermissions } from '@/api/sys-role-manager'
import { PropType } from 'vue'
import { Message } from '@arco-design/web-vue'
import { number } from 'echarts'

const checkedKeys = ref([])
const treeData = ref([])

// 定义 Props 接收外部参数
const props = defineProps({
    visible: {
        type: Boolean, // 控制抽屉的可见性
        default: false
    },
    roleData: {
        type: Object as PropType<RoleRecord>, // 角色数据类型
        default: () => ({}) // 默认空对象
    }
})

// 定义 emit，用于父子组件之间的事件传递
const emit = defineEmits(['update:visible'])

// 公共的关闭抽屉方法，复用处理逻辑
const closeDrawer = () => {
    emit('update:visible', false) // 通知父组件修改visible为false关闭抽屉
}

// 获取角色已有的权限
async function setRolePermissions() {
    const { data } = await setPermissions(props.roleData, checkedKeys.value) // 根据角色ID获取权限
}
// 处理“确定”事件
const handleOk = () => {
    console.log(checkedKeys.value)
    setRolePermissions()
    closeDrawer()
    Message.success('权限分配成功')
}

// 处理“取消”事件
const handleCancel = () => closeDrawer()

// 当树的复选框状态变化时触发
function handleCheck(checkedKeysValue: any) {
    checkedKeys.value = checkedKeysValue
}

// 获取所有权限并转换为树形结构
async function fetchAllPermissions() {
    const { data } = await allPermissions() // 从接口获取所有权限数据
    treeData.value = []
    treeData.value.push(data)
}

// 获取角色已有的权限
async function fetchRolePermissions() {
    const { data } = await getPermissions(props.roleData) // 根据角色ID获取权限
    const ids = data.map((permission: RoleRecord) => permission.id)
    checkedKeys.value = []
    checkedKeys.value.push(...ids)
}

// 监听 visible 的变化，当 visible 为 true 时重新获取权限
watch(
    () => props.visible,
    newVal => {
        if (newVal) {
            fetchAllPermissions() // 获取所有权限
            fetchRolePermissions() // 获取当前角色的权限
        }
    }
)

onMounted(async () => {})
</script>

<style lang="scss" scoped></style>
