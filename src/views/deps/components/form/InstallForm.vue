<template>
  <cl-dialog
    :title="t('common.actions.install')"
    :visible="visible"
    width="640px"
    :confirm-loading="loading"
    @confirm="onConfirm"
    @close="onClose"
  >
    <cl-form>
      <cl-form-item :span="4" :label="t('views.env.deps.dependency.form.name')">
        <cl-tag
          v-for="n in names"
          :key="n"
          class="dep-name"
          type="primary"
          :label="n"
          size="small"
        />
      </cl-form-item>
      <cl-form-item :span="4" :label="t('views.env.deps.dependency.form.mode')">
        <el-select v-model="mode">
          <el-option value="all" :label="t('views.env.deps.dependency.form.allNodes')"/>
          <el-option value="selected-nodes" :label="t('views.env.deps.dependency.form.selectedNodes')"/>
        </el-select>
      </cl-form-item>
      <cl-form-item v-if="mode === 'selected-nodes'" :span="4"
                    :label="t('views.env.deps.dependency.form.selectedNodes')">
        <el-select v-model="nodeIds" multiple :placeholder="t('views.env.deps.dependency.form.selectedNodes')">
          <el-option v-for="n in nodes" :key="n.key" :value="n._id" :label="n.name"/>
        </el-select>
      </cl-form-item>
      <cl-form-item :span="4" :label="t('views.env.deps.dependency.form.version')">
        <el-select v-model="version" :disabled="versionsLoading" :placeholder="t('common.status.loading')">
          <el-option
            v-for="(v, $index) in versions"
            :key="$index"
            :label="v"
            :value="v"
          />
        </el-select>
      </cl-form-item>
    </cl-form>
  </cl-dialog>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, ref, watch} from 'vue';
import {translate} from '@/utils';
import useRequest from "@/services/request";

const t = translate;

const endpointL = '/deps/lang';

const {
  get,
} = useRequest();

export default defineComponent({
  name: 'InstallForm',
  props: {
    visible: {
      type: Boolean,
    },
    lang: {
      type: String,
    },
    names: {
      type: Array,
      default: () => {
        return [];
      },
    },
    nodes: {
      type: Array,
      default: () => {
        return [];
      }
    },
    loading: {
      type: Boolean,
    },
  },
  emits: [
    'confirm',
    'close',
  ],
  setup(props, {emit}) {
    const mode = ref('all');
    const nodeIds = ref([]);
    const version = ref('');

    const reset = () => {
      mode.value = 'all';
      nodeIds.value = [];
      version.value = '';
    };

    const onConfirm = () => {
      emit('confirm', {
        mode: mode.value,
        nodeIds: nodeIds.value,
        version: version.value,
      });
      reset();
    };

    const onClose = () => {
      emit('close');
      reset();
    };

    const versions = ref([]);
    const versionsLoading = ref(false);
    const getVersions = async () => {
      if (!props.visible) return;
      versionsLoading.value = true;
      try {
        console.debug('getVersions', props.names[0])
        const res = await get(`${endpointL}/${props.lang}/${props.names[0]}/versions`)
        versions.value = res.data;
        if (versions.value.length > 0) {
          version.value = versions.value[0];
        }
      } finally {
        versionsLoading.value = false;
      }
    };
    watch(() => props.visible, getVersions);
    onBeforeMount(getVersions);

    return {
      mode,
      nodeIds,
      version,
      versions,
      versionsLoading,
      onConfirm,
      onClose,
      t,
    };
  },
});
</script>

<style scoped>
.dep-name {
  margin-right: 10px;
}
</style>
