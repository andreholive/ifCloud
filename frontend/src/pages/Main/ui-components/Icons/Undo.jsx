import React from 'react';

const Undo = ({ size = 16, color = 'gray' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <path d="m 81,481 c 0,11.046 8.954,20 20,20 h 66 c 11.046,0 20,-8.954 20,-20 0,-11.046 -8.954,-20 -20,-20 h -66 c -11.046,0 -20,8.954 -20,20 z M 17.642,128.006 129.926,16.791 c 7.848,-7.773 20.511,-7.713 28.284,0.135 7.773,7.848 7.712,20.511 -0.135,28.284 L 51.267,151 H 337 c 96.495,0 175,78.505 175,175 0,96.495 -78.505,175 -175,175 h -69 c -11.046,0 -20,-8.954 -20,-20 0,-11.046 8.954,-20 20,-20 h 69 c 74.439,0 135,-60.561 135,-135 0,-74.439 -60.561,-135 -135,-135 H 52.164 l 105.037,105.917 c 7.778,7.843 7.725,20.506 -0.118,28.284 -3.9,3.868 -8.992,5.799 -14.083,5.799 -5.146,0 -10.292,-1.975 -14.202,-5.917 L 17.573,212.926 C 6.241,201.594 0,186.526 0,170.5 0,154.474 6.241,139.406 17.642,128.006 Z" />
  </svg>
);

export default Undo;
