export function removeAllWithClass(className: string) {
  const matches = document.getElementsByClassName(className)
  for (let i = 0; i < matches.length; i++) {
    const el: Element | null = matches.item(i)
    if (el != null) el.remove()
  }
}

export function removeAllWithTag(tagName: string) {
  const matches = document.getElementsByTagName(tagName)
  for (let i = 0; i < matches.length; i++) {
    const el: Element | null = matches.item(i)
    if (el != null) el.remove()
  }
}

export function addElementWithClass(className: string, elementType = 'div') {
  const el = document.createElement(elementType)
  el.className = className
  document.body.appendChild(el)
}
