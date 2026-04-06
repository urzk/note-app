// icons from https://fonts.google.com/icons

const SplitscreenLeft = () => (
  <svg height="16px" viewBox="0 -960 960 960" width="16px">
    <path
      fill="currentColor"
      d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v560q0 33-23.5 56.5T360-120H200Zm400 0q-33 0-56.5-23.5T520-200v-560q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H600Zm160-640H600v560h160v-560Z"
    />
  </svg>
);

const SplitscreenRight = () => (
  <svg height="16px" viewBox="0 -960 960 960" width="16px">
    <path
      fill="currentColor"
      d="M600-120q-33 0-56.5-23.5T520-200v-560q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H600Zm-400 0q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v560q0 33-23.5 56.5T360-120H200Zm0-640v560h160v-560H200Z"
    />
  </svg>
);

const SplitscreenTop = () => (
  <svg height="16px" viewBox="0 -960 960 960" width="16px">
    <path
      fill="currentColor"
      d="M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H200Zm0 400q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h560q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm0-80h560v-160H200v160Z"
    />
  </svg>
);

const SplitscreenBottom = () => (
  <svg height="16px" viewBox="0 -960 960 960" width="16px">
    <path
      fill="currentColor"
      d="M200-120q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h560q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm0-400q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H200Zm560-240H200v160h560v-160Z"
    />
  </svg>
);

export { SplitscreenLeft, SplitscreenRight, SplitscreenTop, SplitscreenBottom };
