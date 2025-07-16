import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 새로운 노드가 없을 경우, 기존 노드를 제거한다.
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }
  // 기존 노드가 없을 경우, 새로운 노드를 추가한다.
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 새로운 노드와 기존 노드가 모두 text 타입 일 경우 text를 업데이트한다.
  if (typeof newNode === "string" && typeof oldNode === "string") {
    // text가 동일할 경우 업데이트를 하지 않는다.
    if (newNode === oldNode) {
      return;
    }
    return parentElement.replaceChild(createElement(newNode), parentElement.childNodes[index]);
  }

  // 새로운 노드와 기존 노드의 type이 다를 경우, 새로운 노드를 추가한다.
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(createElement(newNode), parentElement.childNodes[index]);
  }

  // 새로운 노드와 기존 노드의 props를 확인한다.
  updateAttributes(parentElement.childNodes[index], newNode.props || {}, oldNode.props || {});

  // 새로운 노드와 기존노드의 모든 자식 태그를 순회한다.
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(parentElement.childNodes[index], newNode.children[i], oldNode.children[i], i);
  }
}

function updateAttributes(target, originNewProps, originOldProps) {
  // 이벤트 핸들러와 일반 속성을 분리
  const { eventProps: newEventProps, regularProps: newRegularProps } = separateProps(originNewProps);
  const { eventProps: oldEventProps, regularProps: oldRegularProps } = separateProps(originOldProps);

  // 일반 속성 업데이트
  updateRegularAttributes(target, newRegularProps, oldRegularProps);

  // 이벤트 핸들러 업데이트
  updateEventHandlers(target, newEventProps, oldEventProps);

  // 속성이 달라지거나 새로 추가된 속성일 경우 속성을 업데이트한다.
  for (const [attr, value] of Object.entries(originNewProps)) {
    if (originOldProps[attr] === value) {
      continue;
    }
    target.setAttribute(attr, value);
  }

  // 속성이 없어진 경우 속성을 제거한다.
  for (const attr of Object.keys(originOldProps)) {
    if (originNewProps[attr] !== undefined) {
      continue;
    }
    target.removeAttribute(attr);
  }
}

function separateProps(props) {
  const eventProps = {};
  const regularProps = {};

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("on") && typeof value === "function") {
      eventProps[key] = value;
    } else {
      regularProps[key] = value;
    }
  }

  return { eventProps, regularProps };
}

function updateRegularAttributes(target, newProps, oldProps) {
  // 속성이 달라지거나 새로 추가된 속성일 경우 속성을 업데이트한다.
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === value) {
      continue;
    }
    target.setAttribute(attr, value);
  }

  // 속성이 없어진 경우 속성을 제거한다.
  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) {
      continue;
    }
    target.removeAttribute(attr);
  }
}

function updateEventHandlers(target, newEventProps, oldEventProps) {
  // 기존 이벤트 핸들러 제거
  for (const [eventProp, handler] of Object.entries(oldEventProps)) {
    if (!newEventProps[eventProp] || newEventProps[eventProp] !== handler) {
      const eventType = eventProp.slice(2).toLowerCase(); // onClick -> click
      removeEvent(target, eventType, handler);
    }
  }

  // 새로운 이벤트 핸들러 추가
  for (const [eventProp, handler] of Object.entries(newEventProps)) {
    if (!oldEventProps[eventProp] || oldEventProps[eventProp] !== handler) {
      const eventType = eventProp.slice(2).toLowerCase(); // onClick -> click
      addEvent(target, eventType, handler, target._vNode);
    }
  }
}
