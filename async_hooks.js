const async_id_fields = {
  kAsyncIdCounter: 0,
  kDefaultTriggerAsyncId: 0,
  kExecutionAsyncId: 0,
};

// 递增并返回
function newAsyncId() {
  return ++async_id_fields[kAsyncIdCounter];
}

function getDefaultTriggerAsyncId() {
  const defaultTriggerAsyncId = async_id_fields[kDefaultTriggerAsyncId];

  if (defaultTriggerAsyncId < 0) {
    return async_id_fields[kExecutionAsyncId];
  }
  return defaultTriggerAsyncId;
}
