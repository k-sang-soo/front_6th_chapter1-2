// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // vNode가 undefined, null, boolean인 경우 빈 문자열이 담김 textNode를 반환한다.
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // vNode가 문자열, 숫자인 경우 textNode를 반환한다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // vNode가 배열인 경우 DocumentFragment를 생성해야 한다.
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childNode = createElement(child);
      fragment.appendChild(childNode);
    });
    return fragment;
  }

  // vNode가 태그(예: div, span 등)일 때
  if (typeof vNode.type === "string") {
    const $el = document.createElement(vNode.type);

    // props가 있을 경우, props를 vNode의 속성으로 추가한다.
    if (vNode.props) {
      Object.entries(vNode.props || {})
        .filter(([, value]) => value)
        .forEach(([attr, value]) => {
          const attribute = attr === "className" ? "class" : attr;
          $el.setAttribute(attribute, value);
        });
    }

    // children이 있을 경우, children을 vNode의 자식으로 추가한다.
    if (vNode.children) {
      vNode.children.forEach((child) => {
        if (child.props) {
          Object.entries(vNode.props || {})
            .filter(([, value]) => value)
            .forEach(([attr, value]) => {
              const attribute = attr === "className" ? "class" : attr;
              $el.setAttribute(attribute, value);
            });
        }

        $el.appendChild(createElement(child));
      });
    }
    return $el;
  }

  // vNode가 함수형 컴포넌트일 경우
  if (typeof vNode.type === "function") {
    throw new Error("함수형 컴포넌트는 createElement에서 직접 DOM으로 변환할 수 었습니다.");
  }
}

// function updateAttributes($el, props) {}
