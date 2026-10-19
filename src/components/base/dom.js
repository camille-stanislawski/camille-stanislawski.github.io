// Creates an element; `className` is set as a property, other props as attributes.
// Children are nodes or strings (inserted as text, never parsed as HTML).
export function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'className') node.className = value;
    else node.setAttribute(key, value);
  }
  node.append(...children);
  return node;
}
