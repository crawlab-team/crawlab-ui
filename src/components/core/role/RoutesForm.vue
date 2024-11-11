<script setup lang="ts">
const modelValue = defineModel<string[]>();

defineProps<{
  options: SelectOption[];
}>();

defineOptions({ name: 'ClRoutesForm' });
</script>

<template>
  <div class="routes-form">
    <div class="route-group" v-for="(op, $index) in options" :key="$index">
      <div class="route-group-wrapper">
        <el-checkbox class="route-group-item">
          <span class="icon-wrapper">
            <cl-icon :icon="op.icon" />
          </span>
          <span class="label">{{ op.label }}</span>
        </el-checkbox>
        <el-checkbox-group v-if="op.children">
          <el-checkbox
            class="route-group-item"
            v-for="(child, $childIndex) in op.children"
            :key="$childIndex"
          >
            <span class="icon-wrapper">
              <cl-icon :icon="child.icon" />
            </span>
            <span class="label">{{ child.label }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <el-divider />
    </div>
  </div>
</template>

<style scoped>
.routes-form {
  .route-group {
    .route-group-wrapper {
      display: flex;

      .route-group-item {
        margin-right: 30px;
        width: 150px;
        flex: 0 0 auto;

        .icon-wrapper {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          margin-right: 5px;
        }

        .label {
          display: inline-block;
          width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
