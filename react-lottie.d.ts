declare module 'react-lottie' {
  import { Component } from 'react';

  interface Options {
    loop?: boolean;
    autoplay?: boolean;
    animationData: object;
    rendererSettings?: object;
  }

  interface Props {
    options: Options;
    height?: number | string;
    width?: number | string;
    isStopped?: boolean;
    isPaused?: boolean;
  }

  export default class Lottie extends Component<Props> {}
}
