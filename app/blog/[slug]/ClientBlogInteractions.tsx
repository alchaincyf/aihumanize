'use client';

import { useReducer } from 'react';

// 定义一个简单的 reducer 函数
function reducer(state: { count: number }, action: { type: string }) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

export default function ClientBlogInteractions() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  // 实现客户端交互逻辑
  const handleIncrement = () => dispatch({ type: 'increment' });
  const handleDecrement = () => dispatch({ type: 'decrement' });

  return (
    <div className="client-interactions">
      <h3>Blog Interactions</h3>
      <p>Interaction count: {state.count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  );
}