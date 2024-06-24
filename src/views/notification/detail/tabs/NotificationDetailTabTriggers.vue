<script lang="ts">
import { defineComponent } from 'vue';
import useNotificationDetail from '@/views/notification/detail/useNotificationDetail';
import { translate } from '@/utils';

const t = translate;

export default defineComponent({
  name: 'NotificationDetailTabTriggers',
  setup() {
    return {
      ...useNotificationDetail(),
      t,
    };
  },
});
</script>

<template>
  <div class="notification-detail-tab-triggers">
    <!--    <cl-transfer-->
    <!--      v-if="triggersList && triggersEnabled"-->
    <!--      :titles="triggersTitles"-->
    <!--      :data="triggersList"-->
    <!--      :value="triggersEnabled"-->
    <!--      @change="onTriggersChange"-->
    <!--    />-->
    <el-form label-width="150px">
      <el-form-item :label="t('views.notification.triggers.taskTrigger')">
        <el-radio-group v-model="form.task_trigger">
          <el-radio label="task_finish">
            {{ t('views.notification.triggers.taskTriggerFinish') }}
          </el-radio>
          <el-radio label="task_error">
            {{ t('views.notification.triggers.taskTriggerError') }}
          </el-radio>
          <el-radio label="task_empty_results">
            {{ t('views.notification.triggers.taskTriggerEmptyResults') }}
          </el-radio>
          <el-radio label="task_never">
            {{ t('views.notification.triggers.taskTriggerNever') }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.notification-detail-tab-triggers {
  height: 100%;
  min-height: 100%;

  .transfer {
    height: 100%;
    min-height: 100%;
  }

  .el-form {
    margin-top: 20px;
  }
}
</style>