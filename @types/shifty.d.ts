declare module 'shifty' {
  namespace Shifty {
    // Gets called for every tick of the tween. This function is not called on
    // the final step of the animation
    type StepFunction<T, S = {}> = (
      state: T,
      attachment: S | undefined,
      timeElapsed: number) => void

    type StartFunction<T, S = {}> = (state: T, attachment?: S) => void

    const enum TweenEasing {
      Linear = 'linear',
      EaseInQuad = 'easeInQuad',
      EaseOutQuad = 'easeOutQuad',
      EaseInOutQuad = 'easeInOutQuad',
      EaseInCubic = 'easeInCubic',
      EaseOutCubic = 'easeOutCubic',
      EaseInOutCubic = 'easeInOutCubic',
      EaseInQuart = 'easeInQuart',
      EaseOutQuart = 'easeOutQuart',
      EaseInOutQuart = 'easeInOutQuart',
      EaseInQuint = 'easeInQuint',
      EaseOutQuint = 'easeOutQuint',
      EaseInOutQuint = 'easeInOutQuint',
      EaseInSine = 'easeInSine',
      EaseOutSine = 'easeOutSine',
      EaseInOutSine = 'easeInOutSine',
      EaseInExpo = 'easeInExpo',
      EaseOutExpo = 'easeOutExpo',
      EaseInOutExpo = 'easeInOutExpo',
      EaseInCirc = 'easeInCirc',
      EaseOutCirc = 'easeOutCirc',
      EaseInOutCirc = 'easeInOutCirc',
      EaseOutBounce = 'easeOutBounce',
      EaseInBack = 'easeInBack',
      EaseOutBack = 'easeOutBack',
      EaseInOutBack = 'easeInOutBack',
      Elastic = 'elastic',
      SwingFromTo = 'swingFromTo',
      SwingFrom = 'swingFrom',
      SwingTo = 'swingTo',
      Bounce = 'bounce',
      BouncePast = 'bouncePast',
      EaseFromTo = 'easeFromTo',
      EaseFrom = 'easeFrom',
      EaseTo = 'easeTo'
    }

    type TweanEasingObject = {
      to: TweenEasing | function,
      from: TweenEasing | function
    }

    type TweenConfig<State, Attachement = {}> = {
      // Starting position. If omitted, shifty.Tweenable#get is used.
      from?: State
      // Ending position. The keys of this Object should match those of to.
      to?: State,
      // How many milliseconds to animate for.
      duration?: number,
      // How many milliseconds to wait before starting the tween.
      delay?: number
      // Executes when the tween begins.
      start?: StartFunction<State>
      // Executes on every tick.
      step?: StepFunction<State>
      // Cached value that is passed to
      // shifty.startFunction/shifty.stepFunction.
      attachment?: Attachement
      // Easing curve name(s) or shifty.easingFunction(s) to apply to the
      // properties of the tween. If this is an Object, the keys should
      // correspond to to/from. You can learn more about this in the Easing
      // Curves in Depth tutorial.
      easing?: TweenEasing | function | TweanEasingObject
    }

    function tween<State, Attachement = {}>(
      config: TweenConfig<State, Attachement>
    ): Promise
  }
  export = Shifty
}
