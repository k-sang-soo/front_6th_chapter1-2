const eventListeners = new Map();

export function setupEventListeners(root) {
  eventListeners.forEach((listeners, eventType) => {
    // eventType에 해당하는 리스너를 생성한다.
    // eventType에 해당하는 리스너에 selector,handler를 추가한다.
    root.addEventListener(eventType, (event) => {
      listeners.forEach(({ selector, handler }) => {
        // selector가 event.target인 경우 handler를 실행한다.
        if (selector === event.target) {
          handler(event);
        }
      });
    });
  });
}

export function addEvent(element, eventType, handler) {
  // eventType에 해당하는 리스너가 없을 경우, 리스너를 생성한다.
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, []);
  }

  // eventType에 해당하는 리스너에 selector,handler를 추가한다.
  eventListeners.get(eventType).push({ selector: element, handler });
}

export function removeEvent(element, eventType, handler) {
  const listeners = eventListeners.get(eventType);

  // eventListeners에 eventType에 해당하는 리스너가 존재할 경우, 해당 리스너에서 selector,handler를 제거한다.
  if (listeners) {
    const index = listeners.findIndex((listener) => listener.selector === element && listener.handler === handler);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  }
}
