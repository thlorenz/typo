function unhandledCase(x?: never): never {
  throw new Error(`Case ${x} not handled in switch/ternary/if statement`)
}

export {
  unhandledCase
}
