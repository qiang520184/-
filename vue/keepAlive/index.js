() => {
  pendingCacheKey = null;
  if (!slots.default) {
    return null;
  }
  const children = slots.default();
  const rawVNode = children[0];
  if (children.length > 1) {
    if (true) {
      warn(`KeepAlive should contain exactly one component child.`);
    }
    current = null;
    return children;
  } else if (
    !isVNode(rawVNode) ||
    (!(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128))
  ) {
    current = null;
    return rawVNode;
  }
  let vnode = getInnerChild(rawVNode);
  const comp = vnode.type;
  const name = getComponentName(
    isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp
  );
  const { include, exclude, max } = props;
  if (
    (include && (!name || !matches(include, name))) ||
    (exclude && name && matches(exclude, name))
  ) {
    current = vnode;
    return rawVNode;
  }
  const key = vnode.key == null ? comp : vnode.key;
  const cachedVNode = cache.get(key);
  if (vnode.el) {
    vnode = cloneVNode(vnode);
    if (rawVNode.shapeFlag & 128) {
      rawVNode.ssContent = vnode;
    }
  }
  pendingCacheKey = key;
  if (cachedVNode) {
    vnode.el = cachedVNode.el;
    vnode.component = cachedVNode.component;
    if (vnode.transition) {
      setTransitionHooks(vnode, vnode.transition);
    }
    vnode.shapeFlag |= 512;
    keys.delete(key);
    keys.add(key);
  } else {
    keys.add(key);
    if (max && keys.size > parseInt(max, 10)) {
      pruneCacheEntry(keys.values().next().value);
    }
  }
  vnode.shapeFlag |= 256;
  current = vnode;
  return isSuspense(rawVNode.type) ? rawVNode : vnode;
};
